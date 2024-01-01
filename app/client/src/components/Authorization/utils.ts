import { QueryParameterNames } from "../../services/auth/consts";

export const getReturnUrl = (fallbackRoute: string, state?: any): string => {
    if (state) {
        return state.returnUrl;
    }

    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
        // This is an extra check to prevent open redirects.
        console.error("Invalid return url received in query params. The return url needs to have the same origin as the current page.");
    }

    return fromQuery || fallbackRoute;
}