"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.base64ToSignature = exports.base64ToHex = void 0;

const base64ToHex = s => Buffer.from(s, 'base64').toString('hex');

exports.base64ToHex = base64ToHex;

const base64ToSignature = s => ({
  r: Buffer.from(s, 'base64').slice(0, 32),
  s: Buffer.from(s, 'base64').slice(32, 64)
});

exports.base64ToSignature = base64ToSignature;