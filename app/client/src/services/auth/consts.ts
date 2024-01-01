export let ApplicationName: string = process.env.APPLICATION_NAME || "AIOverflow";

const identityPrefix = "identity";

export const QueryParameterNames = {
  ReturnUrl: 'returnUrl',
  Message: 'message'
};

export const IdentityPaths = {
  Register: `${identityPrefix}/register`,
  Login: `${identityPrefix}/login`,
  IsAuthenticated: `${identityPrefix}/isAuthenticated`,
};

export const DefaultGetTimeoutMs = 10000;