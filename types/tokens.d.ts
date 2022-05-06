import { JwtPayload } from 'jsonwebtoken';
import { ec as EC } from 'elliptic';
import { Web3UserSession } from './types';
export declare const decodeValidWeb3Token: <T extends JwtPayload>(token: string, getEcPubKey: (jwt: T) => EC.KeyPair) => T | null;
export declare const parseWeb3Token: (token: string | null | undefined) => Web3UserSession | null;
