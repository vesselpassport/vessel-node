import { Vessel, Web3UserSession } from '../lib';

describe('Vessel tests', () => {
  const TEST_AUTH_TOKEN =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJYenhtNkVnNExKa0FRY2h1dDVxV0NkWWo3dHlxLXFSckdiSFdDODVGejlVIiwiZWN5IjoiYndyMkZSNm9waUNOV1NBbUZrVlRpb3QzOE5JRS0teTA3alpQclR2RWRXSSIsImF1ZCI6InNob3BoZWxsb3NvY2tzLmNvbSIsImlhdCI6MTY1MTg1MTYyNSwiZXhwIjoxNjUxODUyNTI1fQ.D_bpfXYSitnMZmJXY66xpVNsJCjFvoCckvZGOemuVSnk2cRwbH7l7u3VIJptsE7yAmbvsxOllLi22AShE7CjRA';
  const TEST_EMAIL_ATTESTATION =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdHNfdHlwZSI6InZlcmlmaWVkX2VtYWlsIiwiYXRzX2RhdGEiOiJiZXllbTcwMzU1QGJ1bmxldHMuY29tIiwiZXhwIjoxNjgzMzg3ODEwLCJpc3MiOiJ2ZXNzZWwiLCJzdWIiOiJYenhtNkVnNExKa0FRY2h1dDVxV0NkWWo3dHlxLXFSckdiSFdDODVGejlVIn0.QxpFTy8FcmaKFoJdRAQeZ7qQi5ppqI2Hb5Cl0oXq-5Jzc3LcwJ-XPbkjKUAb6C2y5kRzVQQwxJimiSqkiWoCgA';
  const TEST_SMS_ATTESTATION =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdHNfdHlwZSI6InZlcmlmaWVkX3NtcyIsImF0c19kYXRhIjoiKzEzODUyMTMxODM2IiwiZXhwIjoxNjgzMzg2ODg2LCJpc3MiOiJ2ZXNzZWwiLCJzdWIiOiJYenhtNkVnNExKa0FRY2h1dDVxV0NkWWo3dHlxLXFSckdiSFdDODVGejlVIn0.-ZTfNzBGwkGKTlUQ4mgewfAFAH_qmE33F6OBzHF8uZHSePF5xZwwMfARi0k3X1_rz7nWNLd9DXA18N4cx-u3kQ';

  const TEST_USER: Web3UserSession = {
    userId: 'Xzxm6Eg4LJkAQchut5qWCdYj7tyq-qRrGbHWC85Fz9U',
    scope: 'shophellosocks.com',
    createdAt: new Date(1651851625000),
    expiresAt: new Date(1651852525000),
    isValid: true,
    attestations: {},
  };
  const TEST_EMAIL = 'beyem70355@bunlets.com';
  const TEST_SMS = '+13852131836';

  const setupVessel = (scopes: string[] = ['shophellosocks.com']): Vessel => {
    jest.useFakeTimers().setSystemTime(new Date(1651852520000));
    const vessel = new Vessel();
    scopes.forEach((scope) => vessel.addPermittedScope(scope));
    return vessel;
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  test('throws error with no scopes', () => {
    const vessel = new Vessel();
    expect(() => {
      vessel.getWeb3UserContext({});
    }).toThrow('No permitted scopes are configured - use vessel.addPermittedScope() to allow at least one server name');
  });

  test('gets user', () => {
    const vessel = setupVessel();
    const user = vessel.getWeb3UserContext({ web3auth: TEST_AUTH_TOKEN });
    expect(user).toEqual(TEST_USER);
  });

  test('returns null for wrong scope', () => {
    const vessel = setupVessel(['stytch.com']);
    const user = vessel.getWeb3UserContext({ web3auth: TEST_AUTH_TOKEN });
    expect(user).toEqual(null);
  });

  test('returns null for expired token', () => {
    const vessel = setupVessel();
    jest.useFakeTimers().setSystemTime(new Date(1651852529000));
    const user = vessel.getWeb3UserContext({ web3auth: TEST_AUTH_TOKEN });
    expect(user).toEqual(null);
  });

  test('test with attestations', () => {
    const vessel = setupVessel();
    const user = vessel.getWeb3UserContext({
      web3auth: TEST_AUTH_TOKEN,
      web3_email: TEST_EMAIL_ATTESTATION,
      web3_sms: TEST_SMS_ATTESTATION,
    });
    expect(user).toEqual({
      ...TEST_USER,
      attestations: {
        email: TEST_EMAIL,
        sms: TEST_SMS,
      },
    });
  });
});
