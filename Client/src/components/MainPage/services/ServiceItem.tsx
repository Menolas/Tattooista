import * as React from "react";
import {ServiceType} from "../../../types/Types";
import {API_URL} from "../../../http";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants";
import {ReactComponent as EditIcon} from "../../../assets/svg/edit.svg";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import {useState} from "react";
import {Confirmation} from "../../common/Confirmation";
import {UpdateServiceDataType} from "./Services";

type PropsType = {
    fakeApi: boolean;
    isAuth: string | null;
    serviceIndex: number;
    service: ServiceType;
    remove: (id: string) => void;
    setUpdateServiceData: React.Dispatch<React.SetStateAction<UpdateServiceDataType>>;
};

export const ServiceItem: React.FC<PropsType> = React.memo(({
    fakeApi,
    isAuth,
    serviceIndex,
    service,
    remove,
    setUpdateServiceData,
}) => {


    const conditions = service.conditions.map((item, i) => {
        return item ? <li key = { i }>{item}</li> : null
    });

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
    }

    const removeCallBack = () => {
        remove(service._id);
    }

    const wallPaperUrl = !fakeApi && service.wallPaper
        ? `url(${API_URL}/serviceWallpapers/${service._id}/${service.wallPaper})`
        : 'url("./uploads/ServicesWallpapers/service.jpg")';

    return (
        <li className="services__item">
            <article className="services__article">
                <span className={'services__item-index'}>{`0${serviceIndex}`}</span>
                { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
                    <div className={"actionBar"}>
                        <button
                            data-tooltip-id="service-tooltip"
                            data-tooltip-content="Edit service item"
                            className={"btn btn--icon"}
                            onClick={() => {
                                setUpdateServiceData(prevState => ({
                                    ...prevState,
                                    isUpdateMode: true,
                                    isEdit: true,
                                    service: service
                                }));
                            }}
                        >
                            <EditIcon/>
                        </button>
                        <button
                            data-tooltip-id="service-tooltip"
                            data-tooltip-content="Delete service item"
                            className={"btn btn--icon"}
                            onClick={() => {
                                setConfirmationData({
                                    needConfirmation: true,
                                    itemId: service._id,
                                    context: 'Are you sure? You about to delete this service FOREVER...',
                                    cb: removeCallBack
                                });
                            }}
                        >
                            <TrashIcon/>
                        </button>
                    </div>
                }
                <div
                    className="services__article-img-wrap"
                    style={{backgroundImage: wallPaperUrl}}
                >{''}</div>
                <div className="services__article-text-block">
                    <h4>{service.title}:</h4>
                    <ul className="services__item-list">
                        {conditions}
                    </ul>
                </div>
            </article>
            <Confirmation
                isOpen={confirmationData.needConfirmation}
                content={confirmationData.context}
                confirm={() => {
                    if (confirmationData.cb) {
                        confirmationData.cb();
                    } else {
                        console.error("Item ID is undefined or callback function is not provided.");
                    }
                }}
                cancel={closeModal}
            />
            <Tooltip id="service-tooltip" />
        </li>
    )
});

ServiceItem.displayName = 'ServiceItem';
