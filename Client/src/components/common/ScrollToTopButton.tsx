import * as React from "react";
import {useEffect, useState} from "react";
import {ReactComponent as ArrowToTopIcon} from "../../assets/svg/arrow-to-top.svg";


export const ScrollToTopButton: React.FC = () => {

    const [showScrollToTopButton, setShowScrollToTopButton] = useState(false)

    useEffect(() => {
        const handleScrollButtonVisibility = () => {
            const scrollPosition = document.documentElement.scrollTop;
            setShowScrollToTopButton(scrollPosition > 300);
        };

        window.addEventListener('scroll', handleScrollButtonVisibility);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScrollButtonVisibility);
        }
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth'});
    };

    return (
        <>
            {showScrollToTopButton &&
                <div className={'scrollToTop'}>
                    <button
                        className={'scrollToTop__btn btn btn--light-bg btn--icon--light'}
                        onClick={handleScrollToTop}
                    >
                        <ArrowToTopIcon />
                    </button>
                </div>
            }
        </>
    );
};
