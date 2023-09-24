import * as React from 'react'
import { useState } from 'react'
import {FaqType} from '../../types/Types'
// @ts-ignore
import Sprite from '../../assets/svg/sprite.svg'
import {ModalPopUp} from '../common/ModalPopUp'
import {UpdateFaqItemFormFormik} from '../Forms/UpdateFaqItemFormFormik'

type PropsType = {
  isAuth: boolean
  faqItem: FaqType
  updateFaqItem: (id: string, values: any) => void
  deleteFaqItem: (id: string) => void
}

export const FaqItem: React.FC<PropsType> = React.memo(({
    isAuth,
    faqItem,
    updateFaqItem,
    deleteFaqItem
}) => {

    let [faqItemClasses, setFaqItemClasses] = useState('faq__item')
    const [isEditMode, setIsEditMode] = useState(false)

    const closeEditModal = () => {
        setIsEditMode(false)
    }

    const editModalTitle = 'Update FAQ item'

    const showFaqItemText = () => {
      setFaqItemClasses('faq__item shown')
    }

    const hideFaqItemText = () => {
      setFaqItemClasses('faq__item')
    }

    return (
      <li
        className={faqItemClasses}
        onMouseOver={() => {
          showFaqItemText()
        }}
        onMouseOut={() => { hideFaqItemText() }}
      >
        <div className="faq__item-header">
          {isAuth &&
            <div className={"actionBar"}>
                <button
                    className={"btn btn--icon"}
                    onClick={() => {setIsEditMode(true)}}
                >
                    <svg><use href={`${Sprite}#edit`}/></svg>
                </button>
                <button
                    className={"btn btn--icon"}
                    onClick={() => {deleteFaqItem(faqItem._id)}}
                >
                    <svg><use href={`${Sprite}#trash`}/></svg>
                </button>
            </div>
          }
          {
            isEditMode &&
            <ModalPopUp
                modalTitle={editModalTitle}
                closeModal={closeEditModal}
            >
                <UpdateFaqItemFormFormik
                    faqItem={faqItem}
                    updateFaqItem={updateFaqItem}
                    closeModal={closeEditModal}
                />
            </ModalPopUp>
          }

          <span className="faq__item-handle">{''}</span>
          <h5 className="faq__item-title">
            {faqItem.question}
          </h5>
        </div>
        <p className="faq__item-text">
          {faqItem.answer}
        </p>
      </li>
    )
})





