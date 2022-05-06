import { SignatureInput } from 'elliptic';

export const base64ToHex = (s: string): string => Buffer.from(s, 'base64').toString('hex');

export const base64ToSignature = (s: string): SignatureInput => ({
  r: Buffer.from(s, 'base64').slice(0, 32),
  s: Buffer.from(s, 'base64').slice(32, 64),
});
