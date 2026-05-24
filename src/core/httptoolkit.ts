import { ZodType } from 'zod';
import { fetch } from 'netbun';

import { API_URL, BASIC_HEADERS } from '../constants';
import { pinoLogger } from '../util/logger';
import { BasicResponseSchema } from '../schemas/responses';
import { isStatusCodeSuccess } from '../util/helpers';
import { AstraError } from '../util/errors';
import {
  Credentials,
  GETBuilder,
  HandleBuilder,
  MediaBuilder,
  POSTBuilder,
  PreparationOptions,
  PreparedParts,
} from '../schemas/http';
import { DPoPKeys } from '../schemas/crypto';
import { generateDPoP, generateSignature } from '../util/crypto';

export class HttpToolKit {
  private headers: Record<string, string> = { ...BASIC_HEADERS };

  private _proxy?: string;
  private _dpopKeys?: DPoPKeys;

  set proxy(proxy: string) {
    this._proxy = proxy;
    pinoLogger.info({ proxy }, 'set proxy');
  }

  set dpopKeys(dpopKeys: DPoPKeys) {
    this._dpopKeys = dpopKeys;
  }

  set credentials(credentials: Credentials) {
    this.headers = {
      ...this.headers,
      NDCAUTH: `sid=${credentials.sessionId}`,
      NDCDEVICEID: credentials.deviceId,
      AUID: credentials.userId,
    };
  }

  private prepareDPoP = async (
    options: PreparationOptions,
  ): Promise<Record<string, string>> => {
    return {
      ...this.headers,
      ...(this.headers['NDCAUTH'] && {
        DPoP: await generateDPoP(
          this._dpopKeys!,
          options.method,
          `${API_URL}${options.path}`,
          this.headers['NDCAUTH']!.slice(4),
        ),
      }),
    };
  };

  private preparePost = async (
    options: PreparationOptions,
    rawBody: Record<string, any>,
  ): Promise<PreparedParts> => {
    const headers = await this.prepareDPoP(options);
    const timestamp = Date.now();
    const nonce = `${timestamp}_${timestamp}000`;

    const body = JSON.stringify({
      ...rawBody,
      nonce,
      timestamp,
    });

    return {
      headers: {
        ...headers,
        'X-Timestamp': timestamp.toString(),
        'NDC-MSG-SIG': generateSignature(body, timestamp),
        'X-Nonce': nonce,
      },
      body,
    };
  };

  private handle = async <T>(
    builder: HandleBuilder,
    schema: ZodType<T>,
  ): Promise<T> => {
    const basicResponse = BasicResponseSchema.parse(builder.json);

    if (!isStatusCodeSuccess(basicResponse['api:statuscode'])) {
      pinoLogger.error({ path: builder.url }, basicResponse['api:message']);

      throw new AstraError(basicResponse['api:message']);
    }

    pinoLogger.info({ path: builder.url }, basicResponse['api:message']);

    return schema.parse(builder.json);
  };

  private noBodyRequest = async <T>(
    method: 'GET' | 'DELETE',
    builder: GETBuilder,
    schema: ZodType<T>,
  ): Promise<T> => {
    const response = await fetch(`${API_URL}${builder.path}`, {
      method,
      proxy: this._proxy,
      headers: await this.prepareDPoP({ method, path: builder.path }),
    });

    return await this.handle<T>(
      {
        url: builder.path,
        json: await response.json(),
      },
      schema,
    );
  };

  public unsetProxy = (): void => {
    this._proxy = undefined;
  };

  public get = async <T>(builder: GETBuilder, schema: ZodType<T>): Promise<T> =>
    await this.noBodyRequest('GET', builder, schema);

  public delete = async <T>(
    builder: GETBuilder,
    schema: ZodType<T>,
  ): Promise<T> => await this.noBodyRequest('DELETE', builder, schema);

  public post = async <T>(
    builder: POSTBuilder,
    schema: ZodType<T>,
  ): Promise<T> => {
    const { headers, body } = await this.preparePost(
      { method: 'POST', path: builder.path },
      builder.body,
    );

    const response = await fetch(`${API_URL}${builder.path}`, {
      headers,
      proxy: this._proxy,
      method: 'POST',
      body,
    });

    return await this.handle<T>(
      {
        url: builder.path,
        json: await response.json(),
      },
      schema,
    );
  };

  public media = async <T>(
    builder: MediaBuilder,
    schema: ZodType<T>,
  ): Promise<T> => {
    const response = await fetch(`${API_URL}${builder.path}`, {
      method: 'POST',
      headers: await this.prepareDPoP({ method: 'POST', path: builder.path }),
      body: builder.body,
      proxy: this._proxy,
    });

    return await this.handle<T>(
      {
        url: builder.path,
        json: await response.json(),
      },
      schema,
    );
  };

  public raw = async (url: string): Promise<string | undefined> =>
    (await fetch(url, { proxy: this._proxy })).body?.text();
}
