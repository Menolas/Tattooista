import * as React from "react";
import {useState} from "react";
import {ServiceType} from "../../types/Types";
import {ServiceItem} from "./ServiceItem";
import {ModalPopUp} from "../common/ModalPopUp";
import {UpdateServiceItemFormFormik} from "../Forms/UpdateServiceItemFormFormik";

type PropsType = {
  fakeApi: boolean;
  isAuth: string;
  services: Array<ServiceType>;
  editService: (id: string, values: FormData) => void;
  addService: (values: FormData) => void;
  deleteService: (id: string) => void;
};

export const Services: React.FC<PropsType> = React.memo(({
  fakeApi,
  isAuth,
  services,
  editService,
  addService,
  deleteService,
}) => {

  const [updateServiceData, setUpdateServiceData] = useState<{
      isUpdateMode: boolean,
      isAdd?: boolean,
      isEdit?: boolean,
      service?: ServiceType | null
  }>({isUpdateMode: false})

  const closeUpdateServiceModal = () => {
      setUpdateServiceData({
          isUpdateMode: false,
          service: null,
          isAdd: false,
          isEdit: false
      });
  };

  const updateServiceModalTitle = 'Update "Services" block';
  const addServiceModalTitle = 'Add a new Service';

  const servicesArray = services.map((item, i) => {
    return (
      <ServiceItem
        key={item._id}
        fakeApi={fakeApi}
        isAuth={isAuth}
        serviceIndex={i + 1}
        service={item}
        deleteService={deleteService}
        setUpdateServiceData={setUpdateServiceData}
      />
    )
  });

  return (
    <section className="page-block services container" id="services">
      {
         isAuth &&
         <button
             className={"btn btn--bg btn--light-bg admin-action-btn"}
             onClick={() => {setUpdateServiceData({
                 isUpdateMode: true,
                 isAdd: true,
                 isEdit: false,
             })}}
         >
             Add Service
         </button>
      }
      <ModalPopUp
            isOpen={updateServiceData.isUpdateMode}
            modalTitle={updateServiceData.isEdit ?
                updateServiceModalTitle : addServiceModalTitle}
            closeModal={closeUpdateServiceModal}
      >
          {
              updateServiceData.isUpdateMode &&
              <UpdateServiceItemFormFormik
                  service={updateServiceData.service}
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
