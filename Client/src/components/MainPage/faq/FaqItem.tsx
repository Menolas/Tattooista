import * as React from "react";
import {useEffect, useState} from "react";
import {FaqType} from "../../../types/Types";
import {ReactComponent as EditIcon} from "../../../assets/svg/edit.svg";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants";
import {Confirmation} from "../../common/Confirmation";

type SetUpdateFaqItemDataType = React.Dispatch<React.SetStateAction<{
    isUpdateMode: boolean;
    faqItem?: FaqType;
}>>;

type PropsType = {
  isAuth: string | null;
  isDeletingInProcess: Array<string>;
  data: FaqType;
  remove: (id: string) => void;
  setEditData: SetUpdateFaqItemDataType;
}

export const FaqItem: React.FC<PropsType> = React.memo(({
    isAuth,
    isDeletingInProcess,
    data,
    remove,
    setEditData,
}) => {

    const [faqItemClasses, setFaqItemClasses] = useState('faq__item');
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
        remove(data._id);
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
                        setEditData({isUpdateMode: true, faqItem: data});
                    }}
                >
                    <EditIcon/>
                </button>
                <button
                    data-tooltip-id="faq-tooltip"
                    data-tooltip-content="Delete FAQ item"
                    className={"btn btn--icon"}
                    disabled={isDeletingInProcess?.some(id => id === data._id)}
                    onClick={() => {
                        setConfirmationData({
                            needConfirmation: true,
                            itemId: data._id,
                            context: 'Are you sure? You about to delete this FAQ item FOREVER...',
                            cb: removeCallBack
                        });
                    }}
                >
                    <TrashIcon/>
                </button>
            </div>
          }
          <h5 className="faq__item-title">
            {data.question}
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
          {data.answer}
        </p>
        <Confirmation
          isOpen={confirmationData.needConfirmation}
          content={confirmationData.context}
          confirm={() => {
              if (confirmationData.cb) {
                  confirmationData.cb();
              } else {
                  console.error("Item ID is undefined or callback function is not provided.");
              }
          }}
          cancel={closeModal}
        />
        <Tooltip id="faq-tooltip" />
      </li>
    );
});

FaqItem.displayName = 'FaqItem';
