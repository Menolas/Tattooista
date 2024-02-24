import * as React from "react"
import {PageType} from "../../types/Types"

type PropsType = {
    pageAbout?: PageType
}

export const About: React.FC<PropsType> = ({pageAbout}) => {
    return (
        <div>
            <h2 className="page-block__title">{pageAbout?.title ? pageAbout.title : 'Tattoo Artist'}</h2>
        </div>
    )
}
