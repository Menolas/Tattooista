import * as React from "react";

export const ErrorMessageWrapper = (msg: string) => {
    return (
        <div className="form__error">
            {msg}
        </div>
    );
};
