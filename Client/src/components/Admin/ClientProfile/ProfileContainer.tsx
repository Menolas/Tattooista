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
import { getClientProfileSelector } from '../../../redux/Clients/clients-selectors'

export const ProfileContainer: React.FC = () => {

  const profile = useSelector(getClientProfileSelector)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    //const urlParams = new URLSearchParams(window.location.search)
    //let actualId = profile._id
    //if(!!profile) actualId = profile._id
    //if (!!urlParams.get('clientId')) actualId = urlParams.get('clientId')
    dispatch(getClientProfile(profile._id))

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

  return (
    <Profile
      profile={profile}
      deleteClient={deleteClientCallBack}
      editClient={editClientCallBack}
      updateClientGallery={updateClientGalleryCallBack}
      deleteClientGalleryPicture={deleteClientGalleryPictureCallBack}
    />
  )
}
