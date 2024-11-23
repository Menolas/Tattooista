import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {UserProfile} from "./UserProfile";
import {ApiErrorMessageModal} from "../common/ApiErrorMessageModal";
import {getApiErrorSelector} from "../../redux/General/general-selectors";
import {deleteUserFromProfile, getUserProfile} from "../../redux/Users/users-reducer";
import {getIsDeletingInProcessSelector, getUserProfileSelector} from "../../redux/Users/users-selectors";
import {getTokenSelector} from "../../redux/Auth/auth-selectors";
import {setApiErrorAC} from "../../redux/General/general-reducer";
import {AppDispatch} from "../../redux/redux-store";

export const UserProfileContainer: React.FC = () => {

  const apiError = useSelector(getApiErrorSelector);
  const profile = useSelector(getUserProfileSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const token = useSelector(getTokenSelector);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let actualId: string | null = profile?._id;
    if (urlParams.get('userId')) actualId = urlParams.get('userId');
    if (actualId) dispatch(getUserProfile(token, actualId));
  }, [dispatch]);

  useEffect(() => {
    if(profile) navigate(`?userId=${profile._id}`);
  }, [profile, navigate]);

  const deleteUserCallBack = async () => {
    let success = await dispatch(deleteUserFromProfile(token, profile._id));
    if (success) navigate("/");
  };

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  };

  return (
      <>
          <UserProfile
              apiError={apiError}
              data={profile}
              isDeletingPicturesInProcess={isDeletingInProcess}
              remove={deleteUserCallBack}
          />
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
