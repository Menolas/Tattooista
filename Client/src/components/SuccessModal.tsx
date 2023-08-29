import * as React from 'react'
import { ConfettiContainer } from './common/Confetti'

export const SuccessModal: React.FC = React.memo(() => {
  console.log("!!!!!!!!SUCCESS!!!!!!!!!!!!!!!")

  return (
    <>
        <ConfettiContainer />
        <div className="success">
          <h1 className={"title--first"}>This is Success!!</h1>
            <p>
                See you soon!!!
            </p>
        </div>
    </>
  )
})
