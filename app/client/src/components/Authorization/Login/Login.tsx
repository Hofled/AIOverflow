import { Component } from "react";
import { LoginActions } from "../../../routing/authorization/actions";
import { ApplicationPaths, QueryParameterNames } from "../../../services/authorization/consts";
import { AuthenticationResultStatus, FailedOperation, SuccessfulOperation } from "../../../services/authorization/models";
import authService from "../../../services/authorization/service";
import { getReturnUrl } from "../utils";

type Props = { action: LoginActions }

type State = { message?: string | null }

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export class Login extends Component<Props, State> {
    private fallbackRoute = `${window.location.origin}/`;

    constructor(props: any) {
        super(props);

        this.state = {
            message: undefined
        };
    }

    componentDidMount() {
        const action = this.props.action;
        switch (action) {
            case LoginActions.Login:
                this.login(getReturnUrl(this.fallbackRoute));
                break;
            case LoginActions.LoginCallback:
                this.processLoginCallback();
                break;
            case LoginActions.LoginFailed:
                const params = new URLSearchParams(window.location.search);
                const error = params.get(QueryParameterNames.Message);
                this.setState({ message: error });
                break;
            case LoginActions.Profile:
                this.redirectToProfile();
                break;
            case LoginActions.Register:
                this.redirectToRegister();
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }
    }

    render() {
        const action = this.props.action;
        const { message } = this.state;

        if (!!message) {
            return <div>{message}</div>
        }
        else {
            switch (action) {
                case LoginActions.Login:
                    return (<div>Processing login</div>);
                case LoginActions.LoginCallback:
                    return (<div>Processing login callback</div>);
                case LoginActions.Profile:
                case LoginActions.Register:
                    return (<div></div>);
                default:
                    throw new Error(`Invalid action '${action}'`);
            }
        }
    }

    async login(returnUrl: string) {
        const state = { returnUrl };
        const result = await authService.signIn(state);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                break;
            case AuthenticationResultStatus.Success:
                this.navigateToReturnUrl(returnUrl);
                break;
            case AuthenticationResultStatus.Fail:
                const failedResult = result as FailedOperation;
                this.setState({ message: failedResult.message });
                break;
            default:
                throw new Error(`Invalid status result ${result.status}.`);
        }
    }

    async processLoginCallback() {
        const url = window.location.href;
        const result = await authService.completeSignIn(url);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                // There should not be any redirects as the only time completeSignIn finishes
                // is when we are doing a redirect sign in flow.
                throw new Error('Should not redirect.');
            case AuthenticationResultStatus.Success:
                const successfulResult = result as SuccessfulOperation;
                const returnUrl = getReturnUrl(this.fallbackRoute, successfulResult.state);
                if (returnUrl) {
                    this.navigateToReturnUrl(returnUrl);
                }
                break;
            case AuthenticationResultStatus.Fail:
                const failedResult = result as FailedOperation;
                this.setState({ message: failedResult.message });
                break;
            default:
                throw new Error(`Invalid authentication result status '${result.status}'.`);
        }
    }

    redirectToRegister() {
        this.redirectToApiAuthorizationPath(`${ApplicationPaths.IdentityRegisterPath}?${QueryParameterNames.ReturnUrl}=${encodeURI(LoginActions.Login)}`);
    }

    redirectToProfile() {
        this.redirectToApiAuthorizationPath(ApplicationPaths.IdentityManagePath);
    }

    redirectToApiAuthorizationPath(apiAuthorizationPath: string) {
        const redirectUrl = `${window.location.origin}/${apiAuthorizationPath}`;
        // It's important that we do a replace here so that when the user hits the back arrow on the
        // browser they get sent back to where it was on the app instead of to an endpoint on this
        // component.
        window.location.replace(redirectUrl);
    }

    navigateToReturnUrl(returnUrl: string) {
        // It's important that we do a replace here so that we remove the callback uri with the
        // fragment containing the tokens from the browser history.
        window.location.replace(returnUrl);
    }
}
