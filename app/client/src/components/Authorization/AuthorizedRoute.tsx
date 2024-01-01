import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { LoginActions } from "../../routing/authorization/actions";
import { QueryParameterNames } from "../../services/authorization/consts";
import authService from "../../services/authorization/service";
import LoginModal from "./Login/LoginModal";

type Props = { role?: string, path: string, element: React.JSX.Element }

type State = { authenticationReady: boolean, authenticated: boolean, authorized: boolean, loginModalOpened: boolean }

export default class AuthorizedRoute extends Component<Props, State> {
    private _subscription?: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            authenticationReady: false,
            authenticated: false,
            authorized: false,
            loginModalOpened: false
        }
    }

    componentDidMount() {
        this._subscription = authService.subscribe(isAuthenticated => this.authenticationChanged(isAuthenticated));
        this.populateAuthenticationState();
    }

    componentWillUnmount() {
        if (this._subscription === undefined) {
            return
        }

        authService.unsubscribe(this._subscription);
    }

    render() {
        const { authenticationReady, authenticated, authorized } = this.state;
        if (!authenticationReady) {
            return <div>Authentication Pending...</div>;
        }
        else {
            if (authenticated) {
                if (!!this.props.role && authorized) {
                    return this.props.element;
                }
                else if (!!!this.props.role) {
                    return this.props.element;
                }

                return <Navigate replace to={this.getRedirectUrl()}></Navigate>
            }

            return <LoginModal isOpen={this.state.loginModalOpened} toggle={() => this.setState({ loginModalOpened: !this.state.loginModalOpened })} onLogin={this.onSuccessfulLogin} />;
        }
    }

    // TODO use the authService to check the authorization state
    async authorized(role: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    onSuccessfulLogin() {
        this.setState({ loginModalOpened: false });
    }

    // TODO make sure that the url is correct
    getRedirectUrl(): string {
        var link = document.createElement("a");
        link.href = this.props.path;
        const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
        return `${LoginActions.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
    }

    async authenticationChanged(authenticated: boolean) {
        this.setState({ authenticationReady: true, authenticated });
    }

    async populateAuthenticationState() {
        const authenticated = await authService.isAuthenticated();
        this.setState({ authenticationReady: true, authenticated });
    }
}
