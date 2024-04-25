import { ComponentType } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

export interface LoaderDataProp<L> {
    loaderData: L;
}

function withLoaderData<L>(Component: ComponentType<any>) {
    return (props: any) => <Component {...props} loaderData={useLoaderData() as L} />;
}

function withNavigation(Component: ComponentType<any>) {
    return (props: any) => <Component {...props} navigate={useNavigate()} />;
}

export { withLoaderData , withNavigation};