import { ZodType } from 'zod';
import { Dispatcher } from 'undici';
import { socksDispatcher, SocksProxies } from 'fetch-socks';

import { BASIC_HEADERS, DISPATCHER_OPTIONS } from '../constants';
import { pinoLogger } from '../util/logger';
import { BasicResponseSchema } from '../schemas/responses';
import { isStatusCodeSuccess } from '../util/helpers';
import { AstraError } from '../util/errors';
import {
  Credentials,
  GETBuilder,
  HandleBuilder,
  POSTBuilder,
} from '../schemas/http';

export class HttpToolKit {
  private headers: Record<string, string> = { ...BASIC_HEADERS };

  private dispatcher?: Dispatcher;

  set proxy(socksProxies: SocksProxies) {
    if (this.dispatcher) this.dispatcher.close();

    this.dispatcher = socksDispatcher(socksProxies, DISPATCHER_OPTIONS);
    pinoLogger.info({ socksProxies }, 'set proxy');
  }

  set credentials(credentials: Credentials) {
    this.headers = {
      ...this.headers,
      NDCAUTH: `sid=${credentials.sessionId}`,
      NDCDEVICEID: credentials.deviceId,
      AUID: credentials.aminoId,
    };
  }

  private prepareHeaders = (): Record<string, string> => {
    return {
      ...this.headers,
      'X-Timestamp': Date.now().toString(),
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
    const response = await fetch(builder.path, {
      headers: this.prepareHeaders(),
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
    const response = await fetch(builder.path, {
      headers: this.prepareHeaders(),
      dispatcher: this.dispatcher as any, // fuck undici-types
      method: 'POST',
      body: builder.body,
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
