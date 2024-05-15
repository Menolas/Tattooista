import * as React from "react";
import { NavLink } from "react-router-dom";

type PropsType = {
    closeMenu: () => void;
}

export const Logo: React.FC<PropsType> = React.memo(({closeMenu}) => {
  return (
    <div className={'logo'}>
      <NavLink
          to={'/'}
          className ="logo__link"
          onClick={() => closeMenu()}
      >
          <div className ={'logo__img'}>{""}</div>
      </NavLink>
    </div>
  )
});
