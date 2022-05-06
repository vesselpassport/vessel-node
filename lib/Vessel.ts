import { IVessel, VesselAttestationTokenClaims, VesselCookies, Web3UserSession } from './types';
import { ec as EC } from 'elliptic';
import { decodeValidWeb3Token, parseWeb3Token } from './tokens';

const VESSEL_PUBLIC_KEY_X = '2890e20192d5da85f3281df77a64b88d39c216b0964c7d6feb67cf76e99e6de1';
const VESSEL_PUBLIC_KEY_Y = '12b05260ed58b932938d9665ea58e0531b45318b987ab5d7dd3461adc3ca8d65';

export class Vessel implements IVessel {
  _permittedScopes: string[] = [];
  _vesselPublicKey: EC.KeyPair;

  constructor() {
    const ec = new EC('p256');
    this._vesselPublicKey = ec.keyFromPublic({
      x: VESSEL_PUBLIC_KEY_X,
      y: VESSEL_PUBLIC_KEY_Y,
    });
  }

  getWeb3UserContext = (cookies: VesselCookies): Web3UserSession | null => {
    if (!this._permittedScopes.length) {
      throw new Error(
        'No permitted scopes are configured - use vessel.addPermittedScope() to allow at least one server name',
      );
    }

    const web3User = parseWeb3Token(cookies['web3auth']);

    if (!web3User || !this._permittedScopes.includes(web3User.scope)) {
      return null;
    }

    const name = this._getAttestation(cookies['web3_name'], web3User.userId);
    if (name) {
      web3User.attestations.name = name;
    }
    const email = this._getAttestation(cookies['web3_email'], web3User.userId);
    if (email) {
      web3User.attestations.email = email;
    }
    const sms = this._getAttestation(cookies['web3_sms'], web3User.userId);
    if (sms) {
      web3User.attestations.sms = sms;
    }

    return web3User;
  };

  addPermittedScope = (servername: string): void => {
    this._permittedScopes.push(servername);
  };

  _getAttestation = (web3Token: string | null | undefined, owner: string): string | null => {
    if (!web3Token) {
      return null;
    }
    try {
      const jwt = decodeValidWeb3Token<VesselAttestationTokenClaims>(web3Token, () => this._vesselPublicKey);

      if (!jwt || jwt.sub !== owner || !jwt.ats_data) {
        return null;
      }
      return jwt.ats_data;
    } catch {
      return null;
    }
  };
}
