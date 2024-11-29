import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {UserProfile} from "./UserProfile";
import {ApiErrorMessageModal} from "../common/ApiErrorMessageModal";
import {getApiErrorSelector} from "../../redux/General/general-selectors";
import {
  deleteUserFromProfile,
  getUserProfile
} from "../../redux/Auth/auth-reducer";
import {
  getUserProfileSelector,
  getTokenSelector,
  getIsDeletingInProcessSelector,
  getUserSelector,
  getAuthAccessErrorSelector,
  getIsFetchingSelector,
} from "../../redux/Auth/auth-selectors";
import {setApiErrorAC} from "../../redux/General/general-reducer";
import {AppDispatch} from "../../redux/redux-store";
import {getRolesSelector} from "../../redux/Users/users-selectors";
import {getRoles} from "../../redux/Users/users-reducer";
import {Preloader} from "../common/Preloader";

export const UserProfileContainer: React.FC = () => {

  const apiError = useSelector(getApiErrorSelector);
  const user = useSelector(getUserSelector);
  const profile = useSelector(getUserProfileSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAuthAccessErrorSelector);
  const roles = useSelector(getRolesSelector);
  const isFetching = useSelector(getIsFetchingSelector);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let actualId: string | null = profile?._id;
    if (urlParams.get('userId')) actualId = urlParams.get('userId');
    if (actualId) {
      dispatch(getUserProfile(token, actualId));
      dispatch(getRoles());
    }
  }, [dispatch]);

  useEffect(() => {
    if(profile) navigate(`?userId=${profile._id}`);
  }, [profile, navigate]);

  useEffect(() => {
    if (accessError) {
      navigate("/noAccess");
    }
  }, [accessError]);

  const deleteUserCallBack = async () => {
    if (profile) {
      let success = await dispatch(deleteUserFromProfile(token, profile?._id));
      if (success) navigate("/");
    }
  };

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  };

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
      {apiError &&
        <ApiErrorMessageModal
            isOpen={!!apiError}
            error={apiError}
            closeModal={setApiErrorCallBack}
        />
      }
    </>
  );
};
