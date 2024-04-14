import * as React from "react";
import { useState } from "react";
import {FaqType} from "../../types/Types";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";
import {Confirmation} from "../common/Confirmation";
import {ModalPopUp} from "../common/ModalPopUp";

type PropsType = {
  isAuth: string;
  faqItem: FaqType;
  updateFaqItem: (id: string, values: any) => void;
  deleteFaqItem: (id: string) => void;
  setFaqItem: (faqItem: FaqType) => void;
  setUpdateFaqItemMode: (mode: boolean) => void;
}

export const FaqItem: React.FC<PropsType> = React.memo(({
    isAuth,
    faqItem,
    deleteFaqItem,
    setFaqItem,
    setUpdateFaqItemMode,
}) => {

    let [faqItemClasses, setFaqItemClasses] = useState('faq__item');
    const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);

    const showFaqItemText = () => {
      setFaqItemClasses('faq__item shown');
    }

    const hideFaqItemText = () => {
      setFaqItemClasses('faq__item');
    }

    const closeModal = () => {
        setNeedConfirmation(false);
    }

    const deleteFaqItemCallBack = () => {
        deleteFaqItem(faqItem._id);
    }

    return (
      <li
        className={faqItemClasses}
      >
        <div className="faq__item-header">
          { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
            <div className={"actionBar"}>
                <button
                    data-tooltip-id="faq-tooltip"
                    data-tooltip-content="Edit FAQ item"
                    className={"btn btn--icon"}
                    onClick={() => {
                        setUpdateFaqItemMode(true);
                        setFaqItem(faqItem);
                    }}
                >
                    <svg><use href={`${Sprite}#edit`}/></svg>
                </button>
                <button
                    data-tooltip-id="faq-tooltip"
                    data-tooltip-content="Delete FAQ item"
                    className={"btn btn--icon"}
                    onClick={() => {setNeedConfirmation(true);}}
                >
                    <svg><use href={`${Sprite}#trash`}/></svg>
                </button>
            </div>
          }
          <h5 className="faq__item-title">
            {faqItem.question}
          </h5>
          <button
              className="btn btn--icon faq__item-handle"
              onMouseOver={() => {showFaqItemText(); }}
              onMouseOut={() => { hideFaqItemText(); }}
          >
              <span>{''}</span>
          </button>
        </div>
        <p className="faq__item-text">
          {faqItem.answer}
        </p>
        <ModalPopUp
              isOpen={needConfirmation}
              modalTitle={''}
              closeModal={closeModal}
          >
          <Confirmation
              content={'Are you sure? You about to delete this FAQ item FOREVER...'}
              confirm={deleteFaqItemCallBack}
              cancel={closeModal}
          />
        </ModalPopUp>
        <Tooltip id="faq-tooltip" />
      </li>
    )
})





