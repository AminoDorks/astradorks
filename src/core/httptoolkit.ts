import { ZodType } from 'zod';
import { Dispatcher } from 'undici';
import { socksDispatcher, SocksProxies } from 'fetch-socks';

import { API_URL, BASIC_HEADERS, DISPATCHER_OPTIONS } from '../constants';
import { pinoLogger } from '../util/logger';
import { BasicResponseSchema } from '../schemas/responses';
import { isStatusCodeSuccess } from '../util/helpers';
import { AstraError } from '../util/errors';
import {
  Credentials,
  GETBuilder,
  HandleBuilder,
  POSTBuilder,
  PreparationOptions,
  PreparedParts,
} from '../schemas/http';
import { DPoPKeys } from '../schemas/crypto';
import { generateDPoP, generateSignature } from '../util/crypto';

export class HttpToolKit {
  private headers: Record<string, string> = { ...BASIC_HEADERS };

  private dispatcher?: Dispatcher;
  private _dpopKeys?: DPoPKeys;

  set proxy(socksProxies: SocksProxies) {
    if (this.dispatcher) this.dispatcher.close();

    this.dispatcher = socksDispatcher(socksProxies, DISPATCHER_OPTIONS);
    pinoLogger.info({ socksProxies }, 'set proxy');
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
      ...(this._dpopKeys && {
        DPoP: await generateDPoP(
          this._dpopKeys,
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

  public get = async <T>(
    builder: GETBuilder,
    schema: ZodType<T>,
  ): Promise<T> => {
    const response = await fetch(`${API_URL}${builder.path}`, {
      headers: await this.prepareDPoP({ method: 'GET', path: builder.path }),
      dispatcher: this.dispatcher as any, // fuck undici-types
    });

    return await this.handle<T>(
      {
        url: builder.path,
        json: await response.json(),
      },
      schema,
    );
  };

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
      dispatcher: this.dispatcher as any, // fuck undici-types
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
}
