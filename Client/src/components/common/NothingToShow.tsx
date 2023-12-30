import * as React from "react"

type PropsType = {
    nothingToShowText?: string
}

export const NothingToShow: React.FC<PropsType> = ({nothingToShowText}) => {
    return (
        <div className={"nothingToShow"}>
            <p>
                Nothing to show here yet
                {nothingToShowText}
            </p>
        </div>
    )
}
