import { RouteObject } from "react-router-dom";
import { Login } from "../../components/Authorization/Login/Login";
import { Logout } from "../../components/Authorization/Logout/Logout";
import { LoginActions, LogoutActions } from "./actions";

const prefix: string = "/authentication";
const authenticationRoutes = {
    Login: `${prefix}/${LoginActions.Login}`,
    LoginFailed: `${prefix}/${LoginActions.LoginFailed}`,
    LoginCallback: `${prefix}/${LoginActions.LoginCallback}`,
    Register: `${prefix}/${LoginActions.Register}`,
    Profile: `${prefix}/${LoginActions.Profile}`,
    Logout: `${prefix}/${LogoutActions.Logout}`,
    LoggedOut: `${prefix}/${LogoutActions.LoggedOut}`,
    LogoutCallback: `${prefix}/${LogoutActions.LogoutCallback}`,
};

const LoginComponent = (action: LoginActions) => <Login action={action}></Login>;
const LogoutComponent = (action: LogoutActions) => <Logout action={action}></Logout>;

const authRouteObjects: RouteObject[] = [
    { path: authenticationRoutes.Login, element: LoginComponent(LoginActions.Login) },
    { path: authenticationRoutes.LoginCallback, element: LoginComponent(LoginActions.LoginCallback) },
    { path: authenticationRoutes.LoginFailed, element: LoginComponent(LoginActions.LoginFailed) },
    { path: authenticationRoutes.Profile, element: LoginComponent(LoginActions.Profile) },
    { path: authenticationRoutes.Register, element: LoginComponent(LoginActions.Register) },
    { path: authenticationRoutes.Logout, element: LogoutComponent(LogoutActions.Logout) },
    { path: authenticationRoutes.LoggedOut, element: LogoutComponent(LogoutActions.LoggedOut) },
    { path: authenticationRoutes.LogoutCallback, element: LogoutComponent(LogoutActions.LogoutCallback) }
];

export default authRouteObjects;
