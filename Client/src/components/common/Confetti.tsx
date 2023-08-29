import * as React from 'react'
import Confetti from 'react-confetti'

export const ConfettiContainer = () => {
    return (
        <div className={"confetti"}>
            <Confetti
                colors={['#000', '#fff']}
            />
        </div>
    )
}
