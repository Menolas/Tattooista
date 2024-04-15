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

  const [addFaqItemMode, setAddFaqItemMode] = useState(false);
  const [updateFaqItemData, setUpdateFaqItemData] = useState<{
    isUpdateMode: boolean, faqItem?: FaqType
  }>({isUpdateMode: false});

  const updateFaqItemModalTitle = 'Update FAQ';
  const addFaqItemTitle = 'Add FAQ';

  const faqItemsArray = faq?.map(item => {
    return (
      <FaqItem
        key={item._id}
        isAuth={isAuth}
        faqItem={item}
        updateFaqItem={updateFaqItem}
        deleteFaqItem={deleteFaqItem}
        setUpdateFaqItemData={setUpdateFaqItemData}
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
              onClick={() => {setAddFaqItemMode(true);}}
          >Add Faq</button>
        }
        <ModalPopUp
          isOpen={updateFaqItemData.isUpdateMode || addFaqItemMode}
          modalTitle={ updateFaqItemData.isUpdateMode ?
              updateFaqItemModalTitle : addFaqItemTitle }
          closeModal={() => {
            setUpdateFaqItemData({isUpdateMode: false});
            setAddFaqItemMode(false);
          }}
        >
          { (updateFaqItemData.isUpdateMode || addFaqItemMode) &&
              <UpdateFaqItemFormFormik
                  faqItem={updateFaqItemData.faqItem}
                  updateFaqItem={updateFaqItem}
                  addFaqItem={addFaqItem}
                  closeModal={() => {
                    setUpdateFaqItemData({isUpdateMode: false});
                    setAddFaqItemMode(false);
                  }}
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
