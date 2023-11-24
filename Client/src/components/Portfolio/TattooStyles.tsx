import * as React from "react"
import {useState} from "react"
import * as classNames from "classnames"
import "react-alice-carousel/lib/alice-carousel.css"
import {TattooStyleType} from "../../types/Types"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"
import {UpdateTattooStyleFormFormik} from "../Forms/UpdateTattooStyleFormFormik"
import {ModalPopUp} from "../common/ModalPopUp"
import {SuccessPopUp} from "../common/SuccessPopUp"
import AliceCarousel from "react-alice-carousel"
import {Tooltip} from "react-tooltip"

const responsive = {
  0: {items: 3},
  600: {items: 3},
  900: {items: 4},
  1400: {items: 6},
}

type PropsType = {
  isAuth: boolean
  isSuccess: boolean
  tattooStyles: Array<TattooStyleType>,
  activeStyle: TattooStyleType,
  resetActiveStyle: (style: TattooStyleType) => void
  addTattooStyle: (values: FormData) => void
  editTattooStyle: (id: string, values: FormData) => void
  deleteTattooStyle: (id: string) => void
  setIsSuccess: (bol: boolean) => void
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
  setIsSuccess
}) => {
  const [addTattooStyleMode, setAddTattooStyleMode] = useState(false)
  const [editTattooStyleMode, setEditTattooStyleMode] = useState(false)
  const modalTitle = 'Add a Tattoo Style'
  const successPopUpContent = "You successfully added a new style for your gallery"

  const closeModal = () => {
    setAddTattooStyleMode(false)
  }

  const closeEditModal = () => {
      setEditTattooStyleMode(false)
  }

  const tattooStylesAliceArray = tattooStyles
    ?.map((item) => {
      let itemClasses = "tattoo-style__item"
      if (activeStyle) {
        itemClasses = classNames('tattoo-style__item', {'active': activeStyle._id === item._id})
      }

      return (
        <div
          className={itemClasses}
          onClick={() => {resetActiveStyle(item)}}
        >
          {item.value}
        </div>
      )
    })

  return (
    <section className="tattoo-style page-block">
      { isAuth &&
        <button
            className={"btn btn--sm btn--light-bg"}
            onClick={() => {setAddTattooStyleMode(true)}}
        >
            Add a Tattoo Style
        </button>
      }
      {
        addTattooStyleMode &&
          <ModalPopUp
              modalTitle={modalTitle}
              closeModal={closeModal}
          >
              <UpdateTattooStyleFormFormik
                  addTattooStyle={addTattooStyle}
                  closeModal={closeModal}
              />
          </ModalPopUp>
      }
      <div className="tattoo-style__list">
        <AliceCarousel
          items={tattooStylesAliceArray}
          responsive={responsive}
          controlsStrategy="alternate"
          mouseTracking={true}
        />
      </div>
      <div className="tattoo-style__item-content">
        { isAuth &&
          <div className={"tattoo-style__item-actions"}>
            <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Edit tattoo style"
                className={"btn btn--icon"}
                onClick={() => {setEditTattooStyleMode(true)}}
            >
                <svg><use href={`${Sprite}#edit`}/></svg>
            </button>
            <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Delete tattoo style"
                className={"btn btn--icon"}
                onClick={() => {deleteTattooStyle(activeStyle._id)}}
            >
                <svg><use href={`${Sprite}#trash`}/></svg>
            </button>
          </div>
        }
        {
          editTattooStyleMode &&
          <ModalPopUp
              modalTitle={'Update tattoo style'}
              closeModal={closeEditModal}
          >
              <UpdateTattooStyleFormFormik
                  style={activeStyle}
                  editTattooStyle={editTattooStyle}
                  closeModal={closeEditModal}
              />
          </ModalPopUp>
        }
        {
            isSuccess &&
            <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent} />
        }
        <div>
          <div className="tattoo-style__text">
            {activeStyle ? activeStyle.description : "---"}
          </div>
        </div>
      </div>
      <Tooltip id="my-tooltip" />
    </section>
  )
})
