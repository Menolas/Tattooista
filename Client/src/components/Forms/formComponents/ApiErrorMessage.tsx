import * as React from "react";

export const ApiErrorMessage = ({message}) => {
    return (
        <div className="form__error form__error--api">
            {message}
        </div>
    );
}
