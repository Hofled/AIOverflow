import { ComponentType } from "react";
import { useLoaderData } from "react-router-dom";

export interface LoaderDataProp<L> {
    loaderData: L;
}

function withLoaderData<L>(Component: ComponentType<any>) {
    return (props: any) => <Component {...props} loaderData={useLoaderData() as L} />;
}

export { withLoaderData };