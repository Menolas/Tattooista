import * as React from "react";
import {useState} from "react";
import { FaqType } from "../../types/Types";
import { FaqItem } from "./FaqItem";
import {ModalPopUp} from "../common/ModalPopUp";
import {UpdateFaqItemFormFormik} from "../Forms/UpdateFaqItemFormFormik";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";

type PropsType = {
  isAuth: string;
  faq: Array<FaqType>;
  updateFaqItem: (id: string, values: any) => void;
  addFaqItem: (values: FaqType) => void;
  deleteFaqItem: (id: string) => void;
}

export const FaqItems: React.FC<PropsType> = React.memo(({
  isAuth,
  faq,
  updateFaqItem,
  addFaqItem,
  deleteFaqItem
}) => {

  //const [addFaqItemMode, setAddFaqItemMode] = useState(false);
  const [updateFaqItemMode, setUpdateFaqItemMode] = useState(false);
  const [faqItem, setFaqItem] = useState(null);

  const closeUpdateFaqItemModal = () => {
      setUpdateFaqItemMode(false);
      setFaqItem(null);
  }

  const updateFaqItemModalTitle = 'Update FAQ';

  const faqItemsArray = faq?.map(item => {
    return (
      <FaqItem
        key={item._id}
        isAuth={isAuth}
        faqItem={item}
        updateFaqItem={updateFaqItem}
        deleteFaqItem={deleteFaqItem}
        setFaqItem={setFaqItem}
        setUpdateFaqItemMode={setUpdateFaqItemMode}
      />
    )
  });

  return (
    <section className="page-block faq" id="faq">
      <div className={'container'}>
        {
          (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
          <button
              className={"btn btn--bg btn--light-bg"}
              onClick={() => {setUpdateFaqItemMode(true)}}
          >Add Faq</button>
        }
          <ModalPopUp
              isOpen={updateFaqItemMode}
              modalTitle={updateFaqItemModalTitle}
              closeModal={closeUpdateFaqItemModal}
          >
              {
                  updateFaqItemMode &&
                  <UpdateFaqItemFormFormik
                      faqItem={faqItem}
                      updateFaqItem={updateFaqItem}
                      addFaqItem={addFaqItem}
                      closeModal={closeUpdateFaqItemModal}
                  />
              }

          </ModalPopUp>
        <h2 className="page-block__title">F.A.Q</h2>
        <ul className="faq__list list">
          {faqItemsArray}
        </ul>
      </div>
    </section>
  )
});
