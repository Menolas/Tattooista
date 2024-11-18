import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  getClientProfile,
  deleteClientFromProfile,
  archiveClientFromProfile, toggleFavourite,
} from "../../../redux/Clients/clients-reducer";
import { Profile } from "./Profile";
import {
  getClientProfileSelector, getClientsApiErrorSelector, getClientsIsFavouriteChangingInProcessSelector,
  getIsDeletingPicturesInProcess,
} from "../../../redux/Clients/clients-selectors";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {ApiErrorMessageModal} from "../../common/ApiErrorMessageModal";
import {setApiErrorAC} from "../../../redux/General/general-reducer";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../../redux/redux-store";

export const ProfileContainer: React.FC = () => {

  const profile = useSelector(getClientProfileSelector);
  const isDeletingPicturesInProcess = useSelector(getIsDeletingPicturesInProcess);
  const isFavouriteChangingInProcess = useSelector(getClientsIsFavouriteChangingInProcessSelector);
  const apiError = useSelector(getApiErrorSelector);
  const clientApiError = useSelector(getClientsApiErrorSelector);
  const token = useSelector(getTokenSelector);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let actualId: string | null = profile?._id;
    if (urlParams.get('clientId')) actualId = urlParams.get('clientId');
    if (actualId) dispatch(getClientProfile(token, actualId));
  }, [dispatch]);

  useEffect(() => {
    if(profile) navigate(`?clientId=${profile._id}`);
  }, [profile, navigate]);

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  };

  const toggleIsFavouriteCallBack = (id:string) => {
    dispatch(toggleFavourite(token, id));
  };

  const deleteClientCallBack = async () => {
    let success = await dispatch(deleteClientFromProfile(token, profile._id));
    if (success) navigate("/admin/clients");
  };

  const archiveClientCallBack = async () => {
    let success = await dispatch(archiveClientFromProfile(token, profile._id));
    if (success) navigate("/admin/clients");
  };

  return (
    <>
      <Profile
        key={profile._id + profile.isFavourite}
        apiError={clientApiError}
        data={profile}
        isDeletingPicturesInProcess={isDeletingPicturesInProcess}
        isFavouriteChangingInProcess={isFavouriteChangingInProcess}
        toggleIsFavourite={toggleIsFavouriteCallBack}
        remove={deleteClientCallBack}
        archive={archiveClientCallBack}
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
