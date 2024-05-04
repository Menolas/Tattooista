import * as React from "react";
import {useState} from "react";
import "react-alice-carousel/lib/alice-carousel.css";
import {StyleType} from "../../../types/Types";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import {UpdateTattooStyleForm} from "../../Forms/UpdateTattooStyleForm";
import {ModalPopUp} from "../../common/ModalPopUp";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../../common/Confirmation";
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants";
import {Advertisement} from "../Advertisement";
import {MyCarousel} from "../../common/MyCarousel";
import {Preloader} from "../../common/Preloader";

const responsive = {
  0: {items: 3},
  600: {items: 3},
  900: {items: 4},
  1400: {items: 6},
}

type PropsType = {
  isAuth: string;
  isFetching: boolean;
  styles: Array<StyleType>;
  activeStyle: StyleType;
  isDeletingInProcess: Array<string>;
  resetActiveStyle: (style: StyleType) => void;
  add: (values: FormData) => void;
  edit: (id: string, values: FormData) => void;
  remove: (id: string) => void;
}

export const Styles: React.FC<PropsType> = React.memo(({
  isAuth,
  isFetching,
  styles,
  activeStyle,
  isDeletingInProcess,
  resetActiveStyle,
  add,
  edit,
  remove,
}) => {
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [style, setStyle] = useState(null);
  const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);

  const confirmationText = 'Are you sure? You about to delete this tattoo style FOREVER along with  all the data and images...';

  const closeModal = () => {
    setAddMode(false);
    setEditMode(false);
    setStyle(null);
  }

  const closeConfirmationModalCallBack = () => {
    setNeedConfirmation(false);
  }

  const removeCallBack = () => {
    remove(activeStyle._id);
  }

  const stylesArray = styles
    ?.map((item) => {
        return (
            <Style activeStyle={activeStyle} item={item} resetActiveStyle={resetActiveStyle} />
        )
    });

  return (
    <section className="tattoo-style page-block">
      <div className={'container'}>
        { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
          <button
              className={"btn btn--sm btn--light-bg"}
              onClick={() => {setAddMode(true)}}
          >
              Add a Tattoo Style
          </button>
        }
        {
          !isFetching
            ? (
                <>
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
                            <svg><use href={`${Sprite}#edit`}/></svg>
                          </button>
                          { !activeStyle?.nonStyle &&
                              <button
                                  data-tooltip-id="my-tooltip"
                                  data-tooltip-content="Delete tattoo style"
                                  className={"btn btn--icon"}
                                  disabled={isDeletingInProcess?.some(id => id === activeStyle._id)}
                                  onClick={() => {
                                    setNeedConfirmation(true)
                                  }}
                              >
                                <svg>
                                  <use href={`${Sprite}#trash`}/>
                                </svg>
                              </button>
                          }
                        </div>
                    }
                    <div>
                      <h1 className={'tattoo-style__title page-block__title'}>{activeStyle?.value}</h1>
                      <div className={'tattoo-style__text'}>
                        {activeStyle ? activeStyle.description : "---"}
                      </div>
                    </div>
                  </div>
                  <Advertisement />
                  <MyCarousel
                  items={stylesArray}
                  responsive={responsive}
                  controlsStrategy={"alternate"}
                  />
                </>
              )
            : <Preloader />
        }
        <ModalPopUp
            isOpen={addMode || editMode}
            modalTitle={'Update tattoo styles'}
            closeModal={closeModal}
        >
          {
              <UpdateTattooStyleForm
                  isEditing={editMode}
                  style={style}
                  edit={edit}
                  add={add}
                  closeModal={closeModal}
              />
          }
        </ModalPopUp>
        <ModalPopUp
            isOpen={needConfirmation}
            modalTitle={''}
            closeModal={closeConfirmationModalCallBack}
        >
          <Confirmation
              content={confirmationText}
              confirm={removeCallBack}
              cancel={closeConfirmationModalCallBack}
          />
        </ModalPopUp>
        <Tooltip id="my-tooltip" />
      </div>
    </section>
  )
});

const Style = ({activeStyle, item, resetActiveStyle}: {
  activeStyle: StyleType,
  item: StyleType,
  resetActiveStyle: (style: StyleType) => void
}) => {
  return (
      <div
          className={`tattoo-style__item btn btn--sm ${activeStyle?._id === item._id ? 'btn--light-bg' : 'btn--transparent'}`}
          onClick={() => {resetActiveStyle(item)}}
      >
        {item.value}
      </div>
  )
}
