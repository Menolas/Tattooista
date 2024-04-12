import * as React from "react";
import {useEffect, useState} from "react";
import "react-alice-carousel/lib/alice-carousel.css";
import {BookConsultationFormValues, TattooStyleType} from "../../types/Types";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import {UpdateTattooStyleFormFormik} from "../Forms/UpdateTattooStyleFormFormik";
import {ModalPopUp} from "../common/ModalPopUp";
import {SuccessPopUp} from "../common/SuccessPopUp";
import AliceCarousel from "react-alice-carousel";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../common/Confirmation";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";
import {Advertisement} from "./Advertisement";

const responsive = {
  0: {items: 3},
  600: {items: 3},
  900: {items: 4},
  1400: {items: 6},
}

type PropsType = {
  isAuth: string
  isSuccess: boolean
  tattooStyles: Array<TattooStyleType>,
  activeStyle: TattooStyleType,
  resetActiveStyle: (style: TattooStyleType) => void
  addTattooStyle: (values: FormData) => void
  editTattooStyle: (id: string, values: FormData) => void
  deleteTattooStyle: (id: string) => void
  setIsSuccess: (bol: boolean) => void
  bookConsultation: (values: BookConsultationFormValues) => void
}

export const TattooStyles: React.FC<PropsType> = React.memo(({
  isAuth,
  isSuccess,
  tattooStyles,
  activeStyle,
  resetActiveStyle,
  addTattooStyle,
  editTattooStyle,
  deleteTattooStyle,
  setIsSuccess,
  bookConsultation
}) => {
  const [addTattooStyleMode, setAddTattooStyleMode] = useState(false);
  const [editTattooStyleMode, setEditTattooStyleMode] = useState(false);
  const [style, setStyle] = useState(null);
  const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);
  const successPopUpContent = "You successfully added a new style for your gallery";

  const closeModal = () => {
    setAddTattooStyleMode(false);
    setEditTattooStyleMode(false);
    setStyle(null);
  }

  const closeSuccessModalCallBack = () => {
    setIsSuccess(false);
  }

  const closeConfirmationModalCallBack = () => {
    setNeedConfirmation(false);
  }

  const deleteTattooStyleCallBack = () => {
    deleteTattooStyle(activeStyle._id);
  }

  const tattooStylesAliceArray = tattooStyles
    ?.map((item) => {
      return (
        <div
          className={`tattoo-style__item btn btn--sm ${activeStyle?._id === item._id ? 'btn--light-bg' : 'btn--transparent'}`}
          onClick={() => {resetActiveStyle(item)}}
        >
          {item.value}
        </div>
      )
    });

  return (
    <section className="tattoo-style page-block">
      <div className={'container'}>
        { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
          <button
              className={"btn btn--sm btn--light-bg"}
              onClick={() => {setAddTattooStyleMode(true)}}
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
                    setEditTattooStyleMode(true);
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
        <Advertisement bookConsultation={bookConsultation}/>
        <AliceCarousel
            items={tattooStylesAliceArray}
            responsive={responsive}
            controlsStrategy="alternate"
            mouseTracking={true}
        />
        <ModalPopUp
            isOpen={addTattooStyleMode || editTattooStyleMode}
            modalTitle={'Update tattoo styles'}
            closeModal={closeModal}
        >
          {
              <UpdateTattooStyleFormFormik
                  isEditing={editTattooStyleMode}
                  style={style}
                  editTattooStyle={editTattooStyle}
                  addTattooStyle={addTattooStyle}
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
              content={'Are you sure? You about to delete this tattoo style FOREVER along with  all the data and images...'}
              confirm={deleteTattooStyleCallBack}
              cancel={closeConfirmationModalCallBack}
          />
        </ModalPopUp>
        <SuccessPopUp
            isOpen={isSuccess}
            closeModal={closeSuccessModalCallBack}
            content={successPopUpContent}
        />
        <Tooltip id="my-tooltip" />
      </div>
    </section>
  )
});
