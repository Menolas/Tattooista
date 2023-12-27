import * as React from "react"
import {useEffect, useState} from "react"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"


export const ScrollToTopButton = () => {

    const [showScrollToTopButton, setShowScrollToTopButton] = useState(false)

    useEffect(() => {
        const handleScrollButtonVisibility = () => {
            const scrollPosition = document.documentElement.scrollTop
            setShowScrollToTopButton(scrollPosition > 300)
        };

        window.addEventListener('scroll', handleScrollButtonVisibility)

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScrollButtonVisibility)
        }
    }, [])

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }

    return (
        <>
            {showScrollToTopButton &&
                <div className={'scrollToTop'}>
                    <button
                        className={'scrollToTop__btn btn btn--light-bg btn--icon--light'}
                        onClick={handleScrollToTop}
                    >
                        <svg>
                            <use href={`${Sprite}#arrow-to-top`}/>
                        </svg>
                    </button>
                </div>
            }
        </>
    )
}
