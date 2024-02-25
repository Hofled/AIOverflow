export let ApplicationName: string = process.env.APPLICATION_NAME || "AIOverflow";

const authPrefix = "user";

export const QueryParameterNames = {
  ReturnUrl: 'returnUrl',
  Message: 'message'
};

export const UserPaths = {
  Register: `${authPrefix}/register`,
  Login: `${authPrefix}/login`,
  IsAuthorized: `${authPrefix}/isAuthorized`,
  Info: `${authPrefix}/info`,
};

export const DefaultGetTimeoutMs = 10000;