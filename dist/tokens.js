"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseWeb3Token = exports.decodeValidWeb3Token = void 0;

var _jsonwebtoken = require("jsonwebtoken");

var _elliptic = require("elliptic");

var _utils = require("./utils");

var _cryptoJs = require("crypto-js");

const decodeValidWeb3Token = (token, getEcPubKey) => {
  if (!token) {
    return null;
  }

  try {
    const jwt = (0, _jsonwebtoken.decode)(token, {
      complete: true
    }); // Check headers are valid

    if (!jwt || jwt.header.alg !== 'ES256' || jwt.header.typ !== 'JWT') {
      return null;
    } // Check if payload is valid and not expired


    if (!jwt || !jwt.payload.exp || !jwt.payload.iat || jwt.payload.exp < Date.now() || jwt.payload.iat > Date.now()) {
      return null;
    } // Check signature


    const ecPubKey = getEcPubKey(jwt.payload);
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    if (!ecPubKey.verify((0, _cryptoJs.SHA256)(`${encodedHeader}.${encodedPayload}`).toString(), (0, _utils.base64ToSignature)(encodedSignature))) {
      return null;
    }

    return jwt.payload;
  } catch {
    return null;
  }
};

exports.decodeValidWeb3Token = decodeValidWeb3Token;

const parseWeb3Token = token => {
  if (!token) {
    return null;
  } // JSON Decode the Web3 Token Header section (Token Type & Algo Selection)


  try {
    const jwt = decodeValidWeb3Token(token, decodedJwt => {
      const ec = new _elliptic.ec('p256');
      return ec.keyFromPublic({
        x: (0, _utils.base64ToHex)(decodedJwt.sub),
        y: (0, _utils.base64ToHex)(decodedJwt.ecy)
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
      attestations: {}
    };
  } catch {
    return null;
  }
};

exports.parseWeb3Token = parseWeb3Token;