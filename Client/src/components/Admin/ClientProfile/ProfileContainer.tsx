import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  getClientProfile,
  deleteClientFromProfile,
  archiveClientFromProfile,
} from "../../../redux/Clients/clients-reducer";
import { Profile } from "./Profile";
import {
  getClientProfileSelector, getClientsApiErrorSelector,
  getIsDeletingPicturesInProcess,
} from "../../../redux/Clients/clients-selectors";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {ApiErrorMessageModal} from "../../common/ApiErrorMessageModal";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const ProfileContainer: React.FC = () => {

  const profile = useSelector(getClientProfileSelector);
  const isDeletingPicturesInProcess = useSelector(getIsDeletingPicturesInProcess);
  const apiError = useSelector(getApiErrorSelector);
  const clientApiError = useSelector(getClientsApiErrorSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let actualId: string | null = profile?._id;
    if (urlParams.get('clientId')) actualId = urlParams.get('clientId');
    if (actualId) dispatch(getClientProfile(actualId));

  }, []);

  useEffect(() => {
    if(profile) navigate(`?clientId=${profile._id}`)
  }, [profile]);

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  };

  const deleteClientCallBack = async () => {
    let success = await dispatch(deleteClientFromProfile(profile._id));
    if (success) {
      navigate("/admin/clients");
    }
  };

  const archiveClientCallBack = async () => {
    let success = await dispatch(archiveClientFromProfile(profile._id));
    if (success) {
        navigate("/admin/clients");
    }
  };

  return (
    <>
      <Profile
        apiError={clientApiError}
        data={profile}
        isDeletingPicturesInProcess={isDeletingPicturesInProcess}
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
