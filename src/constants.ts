export const API_URL = 'https://api.astranetapp.com/api/v1';

export const BASIC_HEADERS = {
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Content-Type': 'application/json',
  Connection: 'keep-alive',
  'User-Agent':
    'FuckYou/5.0 (X11; Linux x86_64; rv:149.0) ByAminoDorks/20100101 Firefox/149.0',
  Host: 'api.astranetapp.com',
};

export const DISPATCHER_OPTIONS = {
  connect: {
    rejectUnauthorized: false,
  },
};
