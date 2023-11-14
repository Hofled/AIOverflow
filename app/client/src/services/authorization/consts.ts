export let ApplicationName: string = process.env.APPLICATION_NAME || "AIOverflow";

export const QueryParameterNames = {
  ReturnUrl: 'returnUrl',
  Message: 'message'
};

export const ApplicationPaths = {
  ApiAuthorizationClientConfigurationUrl: `_configuration/${ApplicationName}`,
  IdentityRegisterPath: 'Identity/Account/Register',
  IdentityManagePath: 'Identity/Account/Manage'
};
