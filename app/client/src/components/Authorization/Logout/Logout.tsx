import { Component } from 'react';
import { LogoutActions } from "../../../routing/authorization/actions";
import { AuthenticationResultStatus, FailedOperation, SuccessfulOperation } from "../../../services/authorization/models";
import authService from '../../../services/authorization/service';
import { getReturnUrl } from '../utils';

type Props = {
    action: LogoutActions
}

type State = {
    message?: string | null,
    ready: boolean,
    authenticated: boolean
}


// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export class Logout extends Component<Props, State> {
    private fallbackRoute = `${window.location.origin}${LogoutActions.LoggedOut}`;


    constructor(props: any) {
        super(props);

        this.state = {
            message: undefined,
            ready: false,
            authenticated: false
        };
    }

    componentDidMount() {
        const action = this.props.action;
        switch (action) {
            case LogoutActions.Logout:
                if (!!window.history.state.usr.local) {
                    this.logout(getReturnUrl(this.fallbackRoute));
                } else {
                    // This prevents regular links to <app>/authentication/logout from triggering a logout
                    this.setState({ ready: true, message: "The logout was not initiated from within the page." });
                }
                break;
            case LogoutActions.LogoutCallback:
                this.processLogoutCallback();
                break;
            case LogoutActions.LoggedOut:
                this.setState({ ready: true, message: "You successfully logged out!" });
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }

        this.populateAuthenticationState();
    }

    render() {
        const { ready, message } = this.state;
        if (!ready) {
            return <div></div>
        }
        if (!!message) {
            return (<div>{message}</div>);
        } else {
            const action = this.props.action;
            switch (action) {
                case LogoutActions.Logout:
                    return (<div>Processing logout</div>);
                case LogoutActions.LogoutCallback:
                    return (<div>Processing logout callback</div>);
                case LogoutActions.LoggedOut:
                    return (<div>{message}</div>);
                default:
                    throw new Error(`Invalid action '${action}'`);
            }
        }
    }

    async logout(returnUrl: string) {
        const state = { returnUrl };
        const isAuthenticated = await authService.isAuthenticated();
        if (isAuthenticated) {
            const result = await authService.signOut(state);
            switch (result.status) {
                case AuthenticationResultStatus.Redirect:
                    break;
                case AuthenticationResultStatus.Success:
                    await this.navigateToReturnUrl(returnUrl);
                    break;
                case AuthenticationResultStatus.Fail:
                    const failedResult = result as FailedOperation;
                    this.setState({ message: failedResult.message });
                    break;
                default:
                    throw new Error("Invalid authentication result status.");
            }
        } else {
            this.setState({ message: "You successfully logged out!" });
        }
    }

    async processLogoutCallback() {
        const url = window.location.href;
        const result = await authService.completeSignOut(url);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                // There should not be any redirects as the only time completeAuthentication finishes
                // is when we are doing a redirect sign in flow.
                throw new Error('Should not redirect.');
            case AuthenticationResultStatus.Success:
                const successfulResult = result as SuccessfulOperation;
                await this.navigateToReturnUrl(getReturnUrl(this.fallbackRoute, successfulResult.state));
                break;
            case AuthenticationResultStatus.Fail:
                const failedResult = result as FailedOperation;
                this.setState({ message: failedResult.message });
                break;
            default:
                throw new Error("Invalid authentication result status.");
        }
    }

    async populateAuthenticationState() {
        const authenticated = await authService.isAuthenticated();
        this.setState({ ready: true, authenticated });
    }

    navigateToReturnUrl(returnUrl: string) {
        return window.location.replace(returnUrl);
    }
}
