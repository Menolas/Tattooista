import * as React from "react";
import {useState} from "react";
import { FaqType } from "../../../types/Types";
import { FaqItem } from "./FaqItem";
import {ModalPopUp} from "../../common/ModalPopUp";
import {UpdateFaqItemForm} from "../../Forms/UpdateFaqItemForm";
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants";
import {Preloader} from "../../common/Preloader";

type PropsType = {
  apiError: null | string;
  isFetching: boolean;
  isDeletingInProcess: Array<string>;
  isAuth: string | null;
  faq: Array<FaqType>;
  remove: (id: string) => void;
  setApiError: () => void;
}

export const FaqItems: React.FC<PropsType> = React.memo(({
  apiError,
  isFetching,
  isDeletingInProcess,
  isAuth,
  faq,
  remove,
  setApiError,
}) => {

  const [addFaqItemMode, setAddFaqItemMode] = useState(false);
  const [updateFaqItemData, setUpdateFaqItemData] = useState<{
    isUpdateMode: boolean, faqItem?: FaqType
  }>({isUpdateMode: false});

  // useEffect(() => {
  //   if ((updateFaqItemData.isUpdateMode || addFaqItemMode) && apiError === null) {
  //     setUpdateFaqItemData({isUpdateMode: false});
  //     setAddFaqItemMode(false);
  //   }
  // }, [apiError, addFaqItemMode, updateFaqItemData.isUpdateMode]);

  const updateFaqItemModalTitle = 'Update FAQ';
  const addFaqItemTitle = 'Add FAQ';

  const faqItemsArray = faq?.map(item => {
    return (
      <FaqItem
        key={item._id}
        isDeletingInProcess={isDeletingInProcess}
        isAuth={isAuth}
        data={item}
        remove={remove}
        setEditData={setUpdateFaqItemData}
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
            setApiError();
          }}
        >
          { (updateFaqItemData.isUpdateMode || addFaqItemMode) &&
              <UpdateFaqItemForm
                  apiError={apiError}
                  faqItem={updateFaqItemData.faqItem}
                  closeModal={() => {
                    setUpdateFaqItemData({isUpdateMode: false});
                    setAddFaqItemMode(false);
                  }}
              />
          }

        </ModalPopUp>
        <h2 className="page-block__title">F.A.Q</h2>
        <ul className="faq__list list">
          { isFetching ? <Preloader /> : faqItemsArray }
        </ul>
      </div>
    </section>
  )
});

FaqItems.displayName = 'FaqItems';
