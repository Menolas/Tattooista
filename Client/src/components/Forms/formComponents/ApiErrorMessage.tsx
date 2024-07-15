import * as React from "react";

type PropsType = {
    message: string | null;
}

export const ApiErrorMessage: React.FC<PropsType> = ({message}) => {
    return (
        <div className="form__error form__error--api">
            {message}
        </div>
    );
}
