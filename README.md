# Vessel NodeJS Library

The Vessel NodeJS library makes it easy to integrate with Vessel Web3 identity tokens and attestations in JavaScript applications.

## Install
```console
$ npm install vessel-node
```
or
```console
$ yarn add vessel-node
```

## Usage
### `Vessel()`
To create an instance of Vessel, type save `new Vessel()` somewhere you can access it throughout your code base.

### `Vessel.addPermittedScope(<server_name>)`
This function takes in a string of the server name to accept JWTs for.

__Must be called at least one time before calling `Vessel.getWeb3UserContext()`.__

### `Vessel.getWeb3UserContext(<cookies_object>)`
This function takes in an object with the shape `{ cookie_name: 'cookie_value' }`. With ExpressJS, this corresponds to `req.cookies`.

## Example
Configure a permitted server name scope for incoming sessions:
NOTE: This should match your TLS certificate hostname
```typescript
// vessel.ts
import Vessel from 'vessel-node';

export const vessel = new Vessel();
vessel.addPermittedScope('my.servername.com');
```

Extracting the Web3 User's ID & Attestations from an HTTPS request:
```typescript
import { vessel } from './vessel';

const handleWeb3UserRequest = (req, res) => {
  const web3Session = vessel.getWeb3UserContext(req.cookies);
  if (!web3Session) {
    return res.sendStatus(401);
  }
  const verifiedUsername = web3Session.attestations.name;
  const verifiedEmail = web3Session.attestations.email;
  const verifiedSMS = web3Session.attestations.sms;
  console.log(`[+] Got verified web3 ID session for
User ID: ${web3Session.userId}
Name: ${verifiedUsername}
Email: ${verifiedEmail}
SMS: ${verifiedSMS}`);
  return res.status(200).send(web3Session);
};
```
