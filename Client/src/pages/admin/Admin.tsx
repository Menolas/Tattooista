import * as React from "react";
import {NavLink} from "react-router-dom";
import { Outlet } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getAuthSelector,
} from "../../redux/Auth/auth-selectors";
import { ADMIN_BUTTONS_DATA, } from "../../utils/constants";
import {ReactComponent as AdminIcon} from "../../assets/svg/admin.svg";
import {useCallback, useEffect, useState} from "react";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {
    getSuccessModalSelector
} from "../../redux/General/general-selectors";
import {setSuccessModalAC} from "../../redux/General/general-reducer";

interface ButtonProps {
    btnText: string;
    btnUrl: string;
    subMenu?: SubMenuItemType[];
}

interface SubMenuItemType {
    btnText: string;
    btnUrl: string;
}

export const Admin: React.FC = () => {

  const successModal = useSelector(getSuccessModalSelector);
  const isAuth = useSelector(getAuthSelector);

  const dispatch = useDispatch();

  const setSuccessModalCallBack = useCallback(() => {
    dispatch(setSuccessModalAC(false, ''));
  }, [dispatch]);

  // useEffect(() => {
  //   if (!isAuth || isAuth === "USER") {
  //       dispatch(setFromAC(location.pathname));
  //       navigate('/noAccess');
  //   }
  // }, [dispatch, navigate, isAuth, location.pathname]);

  useEffect(() => {
    if (successModal.isSuccess) {
        setTimeout( () => {
            setSuccessModalCallBack();
        }, 3000);
    }
  }, [setSuccessModalCallBack, successModal]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const AdminButton = ({
    btn
  }: {
      btn: ButtonProps
  }) => {
      return (
        <li key={btn.btnText}>
            <NavLink
                to={btn.btnUrl}
                onClick={() => {
                   setIsMobileMenuOpen(false)
                }}
            >
                {btn.btnText}
            </NavLink>
            {
                btn.subMenu &&
                <ul className={"subMenu list"}>
                    {
                        btn.subMenu.map((subMenuItem) => {
                            return (
                                <li key={subMenuItem.btnUrl}>
                                    <NavLink
                                        to={subMenuItem.btnUrl}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false)
                                        }}
                                    >
                                        {subMenuItem.btnText}
                                    </NavLink>
                                </li>
                            )

                        })
                    }
                </ul>
            }
        </li>
      )
  }

  const adminButtons = ADMIN_BUTTONS_DATA.map((btn, i ) => {
    if (isAuth === "ADMIN") {
        if (btn.btnText !== "Users") {
            return <AdminButton btn={btn} key={`${btn.btnText}-${i}`}/>
        }
    }
    if (isAuth === "SUPER_ADMIN") {
      return <AdminButton btn={btn} key={`${btn.btnText}-${i}`}/>
    }
    return null
  });

  return (
    <div className="admin page-block page-block--top container">
      <button
        className={"btn btn--bg btn--light-bg btn--icon--light admin__left-panel-btn"}
        onClick={() => {
            setIsMobileMenuOpen(true);
        }}
      >
        <AdminIcon />
      </button>
      <aside className={ isMobileMenuOpen ? "admin__left-panel show" : "admin__left-panel"}>
        <nav className={'admin__nav'}>
            <button
               className={"btn btn--transparent closing-btn"}
               onClick={() => {
                   setIsMobileMenuOpen(false);
               }}
            >
                <span>{''}</span>
            </button>
            <ul className="list admin__view-btns admin__nav-list">
                {adminButtons}
            </ul>
        </nav>
      </aside>
      <section className={'admin__content'}>
          <Outlet />
      </section>
      <SuccessPopUp
            isOpen={successModal.isSuccess}
            closeModal={setSuccessModalCallBack}
            content={successModal.successText}
      />
    </div>
  )
};
