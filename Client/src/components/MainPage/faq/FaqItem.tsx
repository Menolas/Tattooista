import * as React from "react";
import {useEffect, useState} from "react";
import {FaqType} from "../../../types/Types";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants";
import {Confirmation} from "../../common/Confirmation";
import {ModalPopUp} from "../../common/ModalPopUp";

type SetUpdateFaqItemDataType = React.Dispatch<React.SetStateAction<{
    isUpdateMode: boolean;
    faqItem?: FaqType;
}>>;

type PropsType = {
  isAuth: string;
  item: FaqType;
  remove: (id: string) => void;
  setEditData: SetUpdateFaqItemDataType;
}

export const FaqItem: React.FC<PropsType> = React.memo(({
    isAuth,
    item,
    remove,
    setEditData,
}) => {

    let [faqItemClasses, setFaqItemClasses] = useState('faq__item');
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
    }

    const removeCallBack = () => {
        remove(item._id);
    }

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
                        setEditData({isUpdateMode: true, faqItem: item});
                    }}
                >
                    <svg><use href={`${Sprite}#edit`}/></svg>
                </button>
                <button
                    data-tooltip-id="faq-tooltip"
                    data-tooltip-content="Delete FAQ item"
                    className={"btn btn--icon"}
                    onClick={() => {
                        setConfirmationData({
                            needConfirmation: true,
                            itemId: item._id,
                            context: 'Are you sure? You about to delete this FAQ item FOREVER...',
                            cb: removeCallBack
                        });
                    }}
                >
                    <svg><use href={`${Sprite}#trash`}/></svg>
                </button>
            </div>
          }
          <h5 className="faq__item-title">
            {item.question}
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
          {item.answer}
        </p>
        <Confirmation
          isOpen={confirmationData.needConfirmation}
          content={confirmationData.context}
          confirm={() => confirmationData.cb()}
          cancel={closeModal}
        />
        <Tooltip id="faq-tooltip" />
      </li>
    )
})





