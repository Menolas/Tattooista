import * as React from "react";
import {NavLink} from "react-router-dom";

type PropsType = {
  message?: string;
}
export const ApiError: React.FC<PropsType> = ({message}) => {
  return (
    <div className="api-error">
      <img src="./uploads/serverError.png" alt="error illustration"/>
      <p>Something went wrong on server: {message}</p>
      <NavLink
          className="btn btn--bg btn--light-bg"
            to="/"
      >Home</NavLink>
    </div>
  );
};
