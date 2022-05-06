import { IVessel, VesselCookies, Web3UserSession } from './types';
import { ec as EC } from 'elliptic';
export declare class Vessel implements IVessel {
    _permittedScopes: string[];
    _vesselPublicKey: EC.KeyPair;
    constructor();
    getWeb3UserContext: (cookies: VesselCookies) => Web3UserSession | null;
    addPermittedScope: (servername: string) => void;
    _getAttestation: (web3Token: string | null | undefined, owner: string) => string | null;
}
