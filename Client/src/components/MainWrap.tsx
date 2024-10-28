import * as React from "react";

type MainWrapProps = {
    children: React.ReactNode;
};
export const MainWrap: React.FC<MainWrapProps> = ({children}) => {
    return (
        <main className={"site-main"}>
            {children}
        </main>
    )
}
