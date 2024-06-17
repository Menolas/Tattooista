import * as React from "react";

export const ErrorMessageWrapper = (msg: any) => {
    return (
        <div className="form__error">
            {msg}
        </div>
    );
};
