import * as React from "react";
import { NavLink } from "react-router-dom";

export const Logo: React.FC = React.memo(() => {
  return (
    <div className={'logo'}>
      <NavLink
          to={'/'}
          className ="logo__link"
      >
          <div className ={'logo__img'}>{""}</div>
      </NavLink>
    </div>
  )
});
