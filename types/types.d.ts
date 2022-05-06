import { JwtPayload } from 'jsonwebtoken';
export interface IVessel {
    addPermittedScope(servername: string): void;
    getWeb3UserContext(cookies: VesselCookies): Web3UserSession | null;
}
export interface VesselAttestationTokenClaims extends JwtPayload {
    ats_type: string;
    ats_data: string;
}
export interface VesselCookies {
    web3auth?: string | null;
    web3_name?: string | null;
    web3_email?: string | null;
    web3_sms?: string | null;
}
export interface VesselAuthTokenClaims extends JwtPayload {
    sub: string;
    ecy: string;
    aud: string;
    iat: number;
    exp: number;
}
export interface VesselUserAttestations {
    name?: string;
    email?: string;
    sms?: string;
}
export interface Web3UserSession {
    userId: string;
    scope: string;
    createdAt: Date;
    expiresAt: Date;
    isValid: boolean;
    attestations: VesselUserAttestations;
}
