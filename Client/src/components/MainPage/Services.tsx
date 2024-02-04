import * as React from "react"
import {useState} from "react"
import {ServiceType} from "../../types/Types"
import {ServiceItem} from "./ServiceItem"
import {ModalPopUp} from "../common/ModalPopUp"
import {UpdateServiceItemFormFormik} from "../Forms/UpdateServiceItemFormFormik"

type PropsType = {
  fakeApi: boolean
  isAuth: boolean
  services: Array<ServiceType>
  editService: (id: string, values: FormData) => void
  addService: (values: FormData) => void
  deleteService: (id: string) => void
}

export const Services: React.FC<PropsType> = React.memo(({
  fakeApi,
  isAuth,
  services,
  editService,
  addService,
  deleteService
}) => {

  const [addServiceMode, setAddServiceMode] = useState(false)
  const closeAddServiceModal = () => {
    setAddServiceMode(false)
  }

  const addServiceModalTitle = 'Add New Service'

  const servicesArray = services.map(item => {
    return (
      <ServiceItem
        key={item._id}
        fakeApi={fakeApi}
        isAuth={isAuth}
        service={item}
        editService={editService}
        deleteService={deleteService}
      />
    )
  })

  return (
    <section className="page-block services" id="services">
      {
         isAuth &&
         <button
             className={"btn btn--bg btn--light-bg"}
             onClick={() => {setAddServiceMode(true)}}
         >
             Add Service
         </button>
      }
      {
          addServiceMode &&
          <ModalPopUp
              modalTitle={addServiceModalTitle}
              closeModal={closeAddServiceModal}
          >
              <UpdateServiceItemFormFormik
                  addService={addService}
                  closeModal={closeAddServiceModal}
              />
          </ModalPopUp>
      }
      <h2 className="page-block__title">Studio services</h2>
      <ul className="services__list list">
        { servicesArray }
      </ul>
    </section>
  )
})
