import * as React from "react";
import { useState } from "react";

interface PropsType {
    id: string;
    text: string;
    amountOfWords?: number;
};

export const ReadMore: React.FC<PropsType> = React.memo(({ id, text, amountOfWords = 32 }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const splittedText = text?.split(' ')
    const itCanOverflow = splittedText.length > amountOfWords
    const beginText = itCanOverflow
        ? splittedText.slice(0, amountOfWords - 1).join(' ')
        : text
    const endText = splittedText.slice(amountOfWords - 1).join(' ')

    const handleKeyboard = (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            setIsExpanded(!isExpanded)
        }
    }

    return (
        <p id={id} className={'read-more'}>
            {beginText}
            {itCanOverflow && (
                <>
                    {!isExpanded && <span>... </span>}
                    <span
                        className={`${!isExpanded && 'hidden'}`}
                        aria-hidden={!isExpanded}
                    >
                        {endText}
                    </span>
                    <span
                        className={isExpanded ? 'read-more__button expanded' : 'read-more__button'}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        aria-controls={id}
                        onKeyDown={handleKeyboard}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'show less' : 'read more'}
                    </span>
                </>
            )}
        </p>
    )
});
