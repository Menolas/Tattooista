import * as React from "react";
import {useEffect, useState} from "react";
import {ServiceType} from "../../types/Types";
import {ServiceItem} from "./ServiceItem";
import {ModalPopUp} from "../common/ModalPopUp";
import {UpdateServiceItemFormFormik} from "../Forms/UpdateServiceItemFormFormik";

type PropsType = {
  fakeApi: boolean
  isAuth: string
  services: Array<ServiceType>
  service: ServiceType
  editService: (id: string, values: FormData) => void
  addService: (values: FormData) => void
  deleteService: (id: string) => void
  setService: (service: ServiceType) => void
};

export const Services: React.FC<PropsType> = React.memo(({
  fakeApi,
  isAuth,
  services,
  service,
  editService,
  addService,
  deleteService,
  setService,
}) => {

  const [updateServiceMode, setUpdateServiceMode] = useState(false);

  const closeUpdateServiceModal = () => {
      setUpdateServiceMode(false);
      setService(null);
  };

  const updateServiceModalTitle = 'Update "Services" block';

  const servicesArray = services.map((item, i) => {
    return (
      <ServiceItem
        key={item._id}
        fakeApi={fakeApi}
        isAuth={isAuth}
        serviceIndex={i + 1}
        service={item}
        deleteService={deleteService}
        setService={setService}
        setUpdateServiceMode={setUpdateServiceMode}
      />
    )
  });

  return (
    <section className="page-block services container" id="services">
      {
         isAuth &&
         <button
             className={"btn btn--bg btn--light-bg"}
             onClick={() => {setUpdateServiceMode(true)}}
         >
             Add Service
         </button>
      }
      <ModalPopUp
            isOpen={updateServiceMode}
            modalTitle={updateServiceModalTitle}
            closeModal={closeUpdateServiceModal}
      >
          {
              updateServiceMode &&
              <UpdateServiceItemFormFormik
                  service={service}
                  addService={addService}
                  editService={editService}
                  closeModal={closeUpdateServiceModal}
              />

          }

      </ModalPopUp>

      <h2 className="page-block__title">Studio services</h2>
      <ul className="services__list list">
        { servicesArray }
      </ul>
    </section>
  )
});
