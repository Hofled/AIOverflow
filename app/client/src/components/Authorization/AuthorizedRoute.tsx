import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { LoginActions } from "../../routing/authorization/actions";
import { QueryParameterNames } from "../../services/authorization/consts";
import authService from "../../services/authorization/service";

type Props = { path: string, element: React.JSX.Element }

type State = { ready: boolean, authenticated: boolean }

export default class AuthorizedRoute extends Component<Props, State> {
    private _subscription?: number;

    constructor(props: any) {
        super(props);

        this.state = {
            ready: false,
            authenticated: false
        }
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.authenticationChanged());
        this.populateAuthenticationState();
    }

    componentWillUnmount() {
        if (this._subscription === undefined) {
            return
        }

        authService.unsubscribe(this._subscription);
    }

    render() {
        const { ready, authenticated } = this.state;        
        if (!ready) {
            return <div>Authentication Pending...</div>;
        } else {
            const { element } = this.props;
            return authenticated ? element : <Navigate replace to={this.getRedirectUrl()} />;
        }
    }

    getRedirectUrl(): string {
        var link = document.createElement("a");
        link.href = this.props.path;
        const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
        return `${LoginActions.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
    }

    async populateAuthenticationState() {
        const authenticated = await authService.isAuthenticated();
        this.setState({ ready: true, authenticated });
    }

    async authenticationChanged() {
        this.setState({ ready: false, authenticated: false });
        await this.populateAuthenticationState();
    }
}
