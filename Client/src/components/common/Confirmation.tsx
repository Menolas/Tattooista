import * as React from 'react'

type PropsType = {
    content: string,
    confirm: () => void
    cancel: () => void
}

export const Confirmation: React.FC<PropsType> = ({
    content,
    confirm,
    cancel
}) => {
    return (
        <div className={'confirmation'}>
            <p className={'confirmation__text'}>{content}</p>
            <div className={'confirmation__actions'}>
                <button
                    className={"btn"}
                    onClick={() => {confirm()}}
                >Yep</button>
                <button
                    className={"btn"}
                    onClick={() => {cancel()}}
                >Nope</button>
            </div>
        </div>
    )
}
