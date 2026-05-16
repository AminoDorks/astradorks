import { createHash, createHmac, getRandomValues, randomUUID } from 'crypto';

import { DPoPKeys } from '../schemas/crypto';

const generateDeviceSalt = (): string =>
  Array.from(getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');

const deriveSignatureKey = (
  deviceSalt: string,
  timestamp: number,
): Uint8Array =>
  Buffer.from([
    ...createHash('sha256').update(deviceSalt, 'utf8').digest().slice(0, 10),
    ...createHash('sha256')
      .update(`sig_${Math.floor(timestamp / 3600000)}`, 'utf8')
      .digest()
      .slice(0, 10),
  ]);

export const generateDPoPKeys = (): DPoPKeys => {
  return {
    dpopKeyId: randomUUID(),
    dpopPublicKey: Buffer.from(getRandomValues(new Uint8Array(32))).toString(
      'base64url',
    ),
  };
};

export const generateSignature = (
  body: string,
  timestamp: number,
  deviceSalt: string = generateDeviceSalt(),
): string =>
  Buffer.from([
    25,
    ...createHmac('sha1', deriveSignatureKey(deviceSalt, timestamp))
      .update(`${body}|${timestamp}`)
      .digest(),
  ]).toString('base64');

export const isJWTExpired = (jwt: string): boolean =>
  JSON.parse(Buffer.from(jwt.split('.')[1]!, 'base64').toString('utf8')).exp <
  Date.now() / 1000;
