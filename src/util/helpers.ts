import { SocksProxies } from 'fetch-socks';
import { PROXY_REGEX } from '../constants';

export const isStatusCodeSuccess = (statusCode: number): boolean =>
  statusCode == 0;

export const transformProxy = (proxy: string): SocksProxies => {
  const matches = proxy.match(PROXY_REGEX);

  if (!matches) throw new TypeError('Invalid proxy format');

  const [, type, userId, password, host, port] = matches;

  return {
    type: type == '4' ? 4 : 5,
    userId,
    password,
    host,
    port: Number(port),
  };
};
