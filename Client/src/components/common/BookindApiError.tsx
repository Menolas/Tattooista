import * as React from 'react'

type PropsType = {
    error: string
}

export const BookingApiError: React.FC<PropsType> = ({error}) => {
    return (
        <div className="modal-wrap bookingApiError">
            <div className="modal-wrap__inner-block">
                <p>Sorry, but something went wrong, please try a bit later</p>
                <p>{error}</p>
            </div>
        </div>
    )
}
