import { createHash, createHmac, getRandomValues, randomUUID } from 'crypto';
import { SignJWT } from 'jose';

import { DPoPKeys } from '../schemas/crypto';

export const generateDeviceSalt = (): string =>
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

export const generateDPoP = async (
  dpopKeys: DPoPKeys,
  method: string,
  url: string,
  accessToken: string,
): Promise<string> => {
  const iat = Math.floor(Date.now() / 1000);

  return await new SignJWT({
    jti: randomUUID(),
    htm: method.toUpperCase(),
    htu: url,
    iat,
    exp: iat + 300,
    ath: createHash('sha256')
      .update(accessToken)
      .digest()
      .toString('base64url'),
  })
    .setProtectedHeader({
      typ: 'dpop+jwt',
      alg: 'HS256',
      jwk: {
        kty: 'oct',
        kid: dpopKeys.dpopKeyId,
      } as any, // fuck jose types
    })
    .sign(Buffer.from(dpopKeys.dpopPublicKey, 'base64url'));
};
