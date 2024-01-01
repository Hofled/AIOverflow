export let ApplicationName: string = process.env.APPLICATION_NAME || "AIOverflow";

export const QueryParameterNames = {
  ReturnUrl: 'returnUrl',
  Message: 'message'
};

export const ApplicationPaths = {
  IdentityRegisterPath: 'identity/register',
  IdentityManagePath: 'identity/Account/Manage'
};
