"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vessel = void 0;

var _elliptic = require("elliptic");

var _tokens = require("./tokens");

const VESSEL_PUBLIC_KEY_X = '2890e20192d5da85f3281df77a64b88d39c216b0964c7d6feb67cf76e99e6de1';
const VESSEL_PUBLIC_KEY_Y = '12b05260ed58b932938d9665ea58e0531b45318b987ab5d7dd3461adc3ca8d65';

class Vessel {
  _permittedScopes = [];

  constructor() {
    const ec = new _elliptic.ec('p256');
    this._vesselPublicKey = ec.keyFromPublic({
      x: VESSEL_PUBLIC_KEY_X,
      y: VESSEL_PUBLIC_KEY_Y
    });
  }

  getWeb3UserContext = cookies => {
    if (!this._permittedScopes.length) {
      throw new Error('No permitted scopes are configured - use vessel.addPermittedScope() to allow at least one server name');
    }

    const web3User = (0, _tokens.parseWeb3Token)(cookies['web3auth']);

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
  addPermittedScope = servername => {
    this._permittedScopes.push(servername);
  };
  _getAttestation = (web3Token, owner) => {
    if (!web3Token) {
      return null;
    }

    try {
      const jwt = (0, _tokens.decodeValidWeb3Token)(web3Token, () => this._vesselPublicKey);

      if (!jwt || jwt.sub !== owner || !jwt.ats_data) {
        return null;
      }

      return jwt.ats_data;
    } catch {
      return null;
    }
  };
}

exports.Vessel = Vessel;