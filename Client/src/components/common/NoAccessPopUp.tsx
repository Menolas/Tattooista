import * as React from "react";
export const NoAccessPopUp: React.FC = () => {
    return (
        <div className={"not-found"}>
            <p>No access</p>
            <img src={'./uploads/noaccess.webp'} alt={''}/>
        </div>
    );
}

NoAccessPopUp.displayName = 'NoAccessPopUp';
