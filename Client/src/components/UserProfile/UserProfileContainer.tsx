import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate,  useSearchParams} from "react-router-dom";
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
  const profile = useSelector(getUserProfileSelector);
  console.log(profile?._id + " Here is our user in container !!!!!!!!!!!!");
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAuthAccessErrorSelector);
  const roles = useSelector(getRolesSelector);
  const isFetching = useSelector(getIsFetchingSelector);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  console.log(userId, " User ID from URL");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let actualId: string | null = profile?._id ?? null;
    if (urlParams.get('userId')) actualId = urlParams.get('userId');
    console.log(urlParams, " urlParams from useEffect");
    if (actualId) {
      dispatch(getRoles());
      dispatch(getUserProfile(token, actualId, roles));
    }
  }, [dispatch, profile?._id]);

  useEffect(() => {
    console.log(`Navigating to ?userId=${profile?._id}`);
    if(profile?._id) navigate(`?userId=${profile._id}`);
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
