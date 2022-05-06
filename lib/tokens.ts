import { decode, Jwt, JwtPayload } from 'jsonwebtoken';
import { ec as EC } from 'elliptic';
import { VesselAuthTokenClaims, Web3UserSession } from './types';
import { base64ToHex, base64ToSignature } from './utils';
import { SHA256 } from 'crypto-js';

type Web3Jwt<T extends JwtPayload> = Jwt & {
  payload: T;
};

export const decodeValidWeb3Token = <T extends JwtPayload>(
  token: string,
  getEcPubKey: (jwt: T) => EC.KeyPair,
): T | null => {
  if (!token) {
    return null;
  }
  try {
    const jwt = decode(token, { complete: true }) as Web3Jwt<T> | null;
    // Check headers are valid
    if (!jwt || jwt.header.alg !== 'ES256' || jwt.header.typ !== 'JWT') {
      return null;
    }

    // Check token exists and is not expired
    if (!jwt || !jwt.payload.exp || jwt.payload.exp * 1000 < Date.now()) {
      return null;
    }

    // Check signature
    const ecPubKey = getEcPubKey(jwt.payload);
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    if (
      !ecPubKey.verify(SHA256(`${encodedHeader}.${encodedPayload}`).toString(), base64ToSignature(encodedSignature))
    ) {
      return null;
    }

    return jwt.payload;
  } catch {
    return null;
  }
};

export const parseWeb3Token = (token: string | null | undefined): Web3UserSession | null => {
  if (!token) {
    return null;
  }
  // JSON Decode the Web3 Token Header section (Token Type & Algo Selection)
  try {
    const jwt = decodeValidWeb3Token<VesselAuthTokenClaims>(token, (decodedJwt) => {
      const ec = new EC('p256');
      return ec.keyFromPublic({
        x: base64ToHex(decodedJwt.sub),
        y: base64ToHex(decodedJwt.ecy),
      });
    });

    if (!jwt) {
      return null;
    }

    return {
      userId: jwt.sub,
      scope: jwt.aud,
      createdAt: new Date(jwt.iat * 1000),
      expiresAt: new Date(jwt.exp * 1000),
      isValid: true,
      attestations: {},
    };
  } catch {
    return null;
  }
};
