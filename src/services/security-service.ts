import { STATIC_DEVICE_ID } from '../constants';
import { HttpToolKit } from '../core/httptoolkit';
import { Account } from '../schemas';
import { LoginResponse, LoginResponseSchema } from '../schemas/responses';
import { cacheGet, cacheSet, initCache } from '../util/cache';
import { generateDPoPKeys, isJWTExpired } from '../util/crypto';

export class SecurityService {
  private httptoolkit: HttpToolKit;

  constructor(httptoolkit: HttpToolKit) {
    this.httptoolkit = httptoolkit;
  }

  public login = async (
    email: string,
    password: string,
    force: boolean = false,
  ): Promise<Account> => {
    await initCache();

    const cachedAccount = cacheGet(`${email}:${password}`);

    if (!force && cachedAccount && !isJWTExpired(cachedAccount.sid)) {
      return cachedAccount.account;
    }

    const dpopKeys = generateDPoPKeys();

    this.httptoolkit.dpopKeys = dpopKeys;

    const response = await this.httptoolkit.post<LoginResponse>(
      {
        path: '/g/s/auth/login',
        body: {
          clientType: 100,
          email,
          secret: `0 ${password}`,
          v: 2,
          deviceID: STATIC_DEVICE_ID,
          dpopAlg: 'HS256',
          ...dpopKeys,
        },
      },
      LoginResponseSchema,
    );

    this.httptoolkit.credentials = {
      sessionId: response.sid,
      deviceId: STATIC_DEVICE_ID,
      userId: response.auid,
    };

    cacheSet(`${email}:${password}`, {
      account: response.account,
      sid: response.sid,
      deviceId: STATIC_DEVICE_ID,
      DPoPKeys: dpopKeys,
    });

    return response.account;
  };
}
