export let ApplicationName: string = process.env.APPLICATION_NAME || "AIOverflow";

const authPrefix = "user";

export const QueryParameterNames = {
  ReturnUrl: 'returnUrl',
  Message: 'message'
};

export const IdentityPaths = {
  Register: `${authPrefix}/register`,
  Login: `${authPrefix}/login`,
  IsAuthenticated: `${authPrefix}/isAuthenticated`,
};

export const DefaultGetTimeoutMs = 10000;