export const API_URL = 'https://api.astranetapp.com/api/v1';

export const BASIC_HEADERS = {
  Accept: '*/*',
  'Accept-Language': 'en-US',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Content-Type': 'application/json',
  Connection: 'keep-alive',
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0',
  Host: 'api.astranetapp.com',
};

export const DISPATCHER_OPTIONS = {
  connect: {
    rejectUnauthorized: false,
  },
};

export const PROXY_REGEX =
  /^socks?([45])?:\/\/(?:(.+?):(.+?)@)?([^:]+):(\d+)$/i; // thanks to qwen3.6-plus
