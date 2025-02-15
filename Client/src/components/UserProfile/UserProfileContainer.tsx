import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {UserProfile} from "./UserProfile";
import {getApiErrorSelector} from "../../redux/General/general-selectors";
import {getRoles} from "../../redux/Users/users-reducer";
import {
  deleteUserFromProfile,
} from "../../redux/Auth/auth-reducer";
import {
  getUserProfileSelector,
  getTokenSelector,
  getIsDeletingInProcessSelector,
  getIsFetchingSelector, getIsAuthSelector,
} from "../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../redux/redux-store";
import {getRolesSelector} from "../../redux/Users/users-selectors";
import {Preloader} from "../common/Preloader";
import {NoAccessPopUp} from "../PopUps/NoAccessPopUp";
import {useEffect} from "react";

export const UserProfileContainer: React.FC = () => {

  const apiError = useSelector(getApiErrorSelector);
  const isAuth = useSelector(getIsAuthSelector);
  const profile = useSelector(getUserProfileSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const token = useSelector(getTokenSelector);
  const roles = useSelector(getRolesSelector);
  const isFetching = useSelector(getIsFetchingSelector);
  console.log(JSON.stringify(profile) + " isAuth!!!!!!!!!!!!")

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roles.length) dispatch(getRoles());
  }, []);

  const deleteUserCallBack = async () => {
    if (profile) {
      let success = await dispatch(deleteUserFromProfile(token, profile?._id));
      if (success) navigate("/");
    }
  };

  const closeModal = () => {
    navigate("/");
  }

  return (
    <>
      {isFetching
        ? <Preloader />
        : <UserProfile
             apiError={apiError}
             data={profile}
             isDeletingPicturesInProcess={isDeletingInProcess}
             possibleRoles={roles}
             remove={deleteUserCallBack}
            />
      }
      <NoAccessPopUp isOpen={!isAuth} closeModal={closeModal}/>
    </>
  );
};
