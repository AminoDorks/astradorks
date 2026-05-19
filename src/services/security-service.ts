import { STATIC_DEVICE_ID } from '../constants';
import { HttpToolKit } from '../core/httptoolkit';
import { Account } from '../schemas';
import { Login, LoginSchema } from '../schemas/responses';
import { cacheGet, cacheSet, initCache } from '../util/cache';
import { generateDPoPKeys, isJWTExpired } from '../util/crypto';
import { AstraError } from '../util/errors';

export class SecurityService {
  private httptoolkit: HttpToolKit;

  private _account?: Account;

  constructor(httptoolkit: HttpToolKit) {
    this.httptoolkit = httptoolkit;
  }

  get account(): Account {
    if (!this._account) throw new AstraError('Unauthorized');
    return this._account;
  }

  public login = async (
    email: string,
    password: string,
    force: boolean = false,
  ): Promise<Account> => {
    await initCache();

    const cachedAccount = cacheGet(`${email}:${password}`);

    if (!force && cachedAccount && !isJWTExpired(cachedAccount.sid)) {
      this.httptoolkit.credentials = {
        sessionId: cachedAccount.sid,
        deviceId: cachedAccount.deviceId,
        userId: cachedAccount.account.uid,
      };

      this.httptoolkit.dpopKeys = cachedAccount.DPoPKeys;

      return (this._account = cachedAccount.account);
    }

    const dpopKeys = generateDPoPKeys();

    this.httptoolkit.dpopKeys = dpopKeys;

    const response = await this.httptoolkit.post<Login>(
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
      LoginSchema,
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

    return (this._account = response.account);
  };
}
