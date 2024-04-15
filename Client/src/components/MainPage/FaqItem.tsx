import * as React from "react";
import {useEffect, useState} from "react";
import {FaqType} from "../../types/Types";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";
import {Confirmation} from "../common/Confirmation";
import {ModalPopUp} from "../common/ModalPopUp";

type SetUpdateFaqItemDataType = React.Dispatch<React.SetStateAction<{
    isUpdateMode: boolean;
    faqItem?: FaqType;
}>>;

type PropsType = {
  isAuth: string;
  faqItem: FaqType;
  updateFaqItem: (id: string, values: any) => void;
  deleteFaqItem: (id: string) => void;
  setUpdateFaqItemData: SetUpdateFaqItemDataType;
}

export const FaqItem: React.FC<PropsType> = React.memo(({
    isAuth,
    faqItem,
    deleteFaqItem,
    setUpdateFaqItemData,
}) => {

    let [faqItemClasses, setFaqItemClasses] = useState('faq__item');
    const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Define your mobile breakpoint here
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Call the handler once to set the initial state

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const showFaqItemText = () => {
      if (!isMobile) {
          setFaqItemClasses('faq__item shown');
      }
    }

    const hideFaqItemText = () => {
      if (!isMobile) {
          setFaqItemClasses('faq__item');
      }
    }

    const toggleFaqItemText = () => {
        if (isMobile) {
            setFaqItemClasses(
                faqItemClasses === "faq__item" ? "faq__item shown" : "faq__item"
            );
        }
    };

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
                        setUpdateFaqItemData({isUpdateMode: true, faqItem: faqItem});
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
              onMouseOver={() => { showFaqItemText(); }}
              onMouseOut={() => { hideFaqItemText(); }}
              onClick={() => { toggleFaqItemText(); }}
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
            { needConfirmation &&
                <Confirmation
                    content={'Are you sure? You about to delete this FAQ item FOREVER...'}
                    confirm={deleteFaqItemCallBack}
                    cancel={closeModal}
                />
            }

        </ModalPopUp>
        <Tooltip id="faq-tooltip" />
      </li>
    )
})





