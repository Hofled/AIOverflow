const authPrefix = "user";

export const UserPaths = {
  Register: `${authPrefix}/register`,
  Login: `${authPrefix}/login`,
  IsAuthorized: `${authPrefix}/isAuthorized`,
  Info: `${authPrefix}/info`,
};

export const DefaultGetTimeoutMs = 10000;