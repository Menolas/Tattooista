import * as React from "react";
import {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getClientProfile,
  updateClientGallery,
  editClient,
  deleteClientGalleryPicture,
  deleteClientFromProfile,
  archiveClientFromProfile,
} from "../../../redux/Clients/clients-reducer";
import { Profile } from "./Profile";
import {
  getClientProfileSelector,
  getIsDeletingPicturesInProcess,
} from "../../../redux/Clients/clients-selectors";

export const ProfileContainer: React.FC = React.memo(() => {

  const profile = useSelector(getClientProfileSelector);
  const isDeletingPicturesInProcess = useSelector(getIsDeletingPicturesInProcess);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let actualId = profile._id;
    if(!!profile) actualId = profile._id;
    if (!!urlParams.get('clientId')) actualId = urlParams.get('clientId');
    dispatch(getClientProfile(actualId));

  }, []);

  useEffect(() => {
    if(!!profile) navigate(`?clientId=${profile._id}`)
  }, [profile]);

  const deleteClientCallBack = (clientId: string) => {
    dispatch(deleteClientFromProfile(clientId));
  }

  const editClientCallBack = (clientId: string, values: FormData) => {
    dispatch(editClient(clientId, values));
  }

  const updateClientGalleryCallBack = (clientId: string, values: FormData) => {
    dispatch(updateClientGallery(clientId, values));
  }

  const archiveClientCallBack = (id: string) => {
    dispatch(archiveClientFromProfile(id));
  }

  const deleteClientGalleryPictureCallBack = (clientId: string, picture: string) => {
    dispatch(deleteClientGalleryPicture(clientId, picture));
  }

  return (
    <Profile
      data={profile}
      isDeletingPicturesInProcess={isDeletingPicturesInProcess}
      remove={deleteClientCallBack}
      edit={editClientCallBack}
      updateGallery={updateClientGalleryCallBack}
      deleteGalleryItem={deleteClientGalleryPictureCallBack}
      archive={archiveClientCallBack}
    />
  )
});
