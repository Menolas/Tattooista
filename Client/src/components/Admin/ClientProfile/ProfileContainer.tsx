import * as React from 'react'
import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  getClientProfile,
  updateClientGallery,
  editClient,
  deleteClient,
  deleteClientGalleryPicture
} from '../../../redux/Clients/clients-reducer'
import { Profile } from './Profile'
import {
  getClientProfileSelector, getIsClientDeletingInProcessSelector,
  getIsDeletingPicturesInProcess,
  getIsSuccessSelector
} from '../../../redux/Clients/clients-selectors'
import {setIsSuccessAC} from "../../../redux/Auth/auth-reducer"

export const ProfileContainer: React.FC = () => {

  const profile = useSelector(getClientProfileSelector)
  const isSuccess = useSelector(getIsSuccessSelector)
  const isDeletingInProcess =useSelector(getIsClientDeletingInProcessSelector)
  const isDeletingPicturesInProcess = useSelector(getIsDeletingPicturesInProcess)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    let actualId = profile._id
    if(!!profile) actualId = profile._id
    if (!!urlParams.get('clientId')) actualId = urlParams.get('clientId')
    dispatch(getClientProfile(actualId))

  }, [])

  useEffect(() => {
    if(!!profile) navigate(`?clientId=${profile._id}`)
  }, [profile])

  const deleteClientCallBack = (clientId: string) => {
    dispatch(deleteClient(clientId))
  }

  const editClientCallBack = (clientId: string, values: FormData) => {
    dispatch(editClient(clientId, values))
  }

  const updateClientGalleryCallBack = (clientId: string, values: FormData) => {
    dispatch(updateClientGallery(clientId, values))
  }

  const deleteClientGalleryPictureCallBack = (clientId: string, picture: string) => {
    dispatch(deleteClientGalleryPicture(clientId, picture))
  }

  const setIsSuccessCallBack = (bol: boolean) => {
    dispatch(setIsSuccessAC(bol))
  }

  return (
    <Profile
      isSuccess={isSuccess}
      profile={profile}
      isDeletingPicturesInProcess={isDeletingPicturesInProcess}
      deleteClient={deleteClientCallBack}
      editClient={editClientCallBack}
      updateClientGallery={updateClientGalleryCallBack}
      deleteClientGalleryPicture={deleteClientGalleryPictureCallBack}
      setIsSuccess={setIsSuccessCallBack}
    />
  )
}
