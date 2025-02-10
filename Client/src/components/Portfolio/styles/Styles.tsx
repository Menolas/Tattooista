import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import "react-alice-carousel/lib/alice-carousel.css";
import {StyleType} from "../../../types/Types";
import {ReactComponent as EditIcon} from "../../../assets/svg/edit.svg";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import {UpdateStyleForm} from "../../Forms/UpdateStyleForm";
import {ModalPopUp} from "../../PopUps/ModalPopUp";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../../common/Confirmation";
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants";
import {Advertisement} from "../../Advertisement";
import {Preloader} from "../../common/Preloader";
import {Slider} from "../../common/Slider";

const responsive = {
  0: {
    slidesPerView: 3,
  },
  900: {
    slidesPerView: 4,
  },
  1400: {
    slidesPerView: 6,
  },
}

type PropsType = {
  apiError: null | string;
  isAuth: string | null;
  isFetching: boolean;
  styles: Array<StyleType>;
  activeStyle: StyleType | null;
  isDeletingInProcess: Array<string>;
  resetActiveStyle: (style: StyleType) => void;
  remove: (id: string) => void;
  setApiError: () => void;
}

export const Styles: React.FC<PropsType> = React.memo(({
  apiError,
  isAuth,
  isFetching,
  styles,
  activeStyle,
  isDeletingInProcess,
  resetActiveStyle,
  remove,
  setApiError,
}) => {
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [style, setStyle] = useState<StyleType | null>(null);
  const [confirmationData, setConfirmationData] = useState<{
    needConfirmation: boolean,
    itemId?: string,
    cb?: () => void,
    context: string
  }>({needConfirmation: false, context: ''});
  const [activeIndex, setActiveIndex] = useState(0);

  const closeModal = useCallback(() => {
    setAddMode(false);
    setEditMode(false);
    setStyle(null);
    setApiError();
  }, [setApiError]);

  useEffect(() => {
    const newActiveIndex = styles.findIndex(style => style._id === activeStyle?._id);
    setActiveIndex(newActiveIndex);
  }, [activeStyle, styles]);

  // useEffect(() => {
  //   if ((editMode || addMode) && apiError === null) {
  //     closeModal();
  //   }
  // }, [apiError, addMode, closeModal, editMode]);

  const closeConfirmationModalCallBack = () => {
    setConfirmationData({needConfirmation: false, context: ''});
  };

  const removeCallBack = () => {
    if (activeStyle && activeStyle._id) {
      remove(activeStyle._id);
    } else {
      console.error("Attempted to remove an undefined style");
    }
  };

  const stylesArray = styles
    ?.map((item) => {
        return (
            <Style
                key={item._id}
                activeStyle={activeStyle}
                item={item}
                resetActiveStyle={resetActiveStyle}
            />
        )
    });

  return (
    <section className="tattoo-style page-block">
        <div className="container">

            { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
              <button
                  className={"btn btn--sm btn--light-bg"}
                  onClick={() => {setAddMode(true)}}
              >
                  Add a Tattoo Style
              </button>
            }

            <div className="tattoo-style__item-content">
              { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
                  <div className={"tattoo-style__item-actions"}>
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Edit tattoo style"
                        className={"btn btn--icon"}
                        onClick={() => {
                          setEditMode(true);
                          setStyle(activeStyle);
                        }}
                    >
                      <EditIcon/>
                    </button>
                    { !activeStyle?.nonStyle &&
                        <button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Delete tattoo style"
                            className={"btn btn--icon"}
                            disabled={isDeletingInProcess?.some(id => id === activeStyle?._id)}
                            onClick={() => {
                              setConfirmationData({
                                needConfirmation: true,
                                itemId: activeStyle?._id,
                                context: 'Are you sure? You about to delete this tattoo style along with all images.',
                                cb: removeCallBack
                              });
                            }}
                        >
                          <TrashIcon/>
                        </button>
                    }
                  </div>
              }
              {!isFetching
                  ? <div>
                      <h1 className={'tattoo-style__title page-block__title'}>{activeStyle?.value}</h1>
                      <div className={'tattoo-style__text'}>
                        {activeStyle ? activeStyle.description : "---"}
                      </div>
                    </div>
                  : <Preloader />
              }
            </div>
            <Advertisement/>
            <Slider
                items={stylesArray}
                activeIndex={activeIndex}
                breakpoints={responsive}
            />
            <ModalPopUp
                isOpen={addMode || editMode}
                modalTitle={'Update tattoo styles'}
                closeModal={closeModal}
            >
              {
                  <UpdateStyleForm
                      apiError={apiError}
                      isEditing={editMode}
                      style={style}
                      closeModal={closeModal}
                  />
              }
            </ModalPopUp>
            <Confirmation
                isOpen={confirmationData.needConfirmation}
                content={confirmationData.context}
                confirm={() => confirmationData.cb ? confirmationData.cb() : undefined}
                cancel={closeConfirmationModalCallBack}
            />
            <Tooltip id="my-tooltip" />
        </div>
    </section>
  )
});

const Style = ({activeStyle, item, resetActiveStyle}: {
  activeStyle: StyleType | null,
  item: StyleType,
  resetActiveStyle: (style: StyleType) => void
}) => {
  return (
      <div
          className={
              `tattoo-style__item btn btn--sm ${activeStyle?._id === item._id 
                  ? 'btn--light-bg' 
                  : 'btn--transparent'}`
          }
          onClick={() => resetActiveStyle(item)}
      >
          <span>{item.value}</span>
      </div>
  );
};

Styles.displayName = 'Styles';
