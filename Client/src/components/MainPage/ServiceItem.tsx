import * as React from "react";
import {ServiceType} from "../../types/Types";
import {API_URL} from "../../http";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";

type PropsType = {
    fakeApi: boolean;
    isAuth: string;
    serviceIndex: number;
    service: ServiceType;
    deleteService: (id: string) => void;
    setService: (service: ServiceType) => void;
    setUpdateServiceMode: (mode: boolean) => void;
};

export const ServiceItem: React.FC<PropsType> = React.memo(({
    fakeApi,
    isAuth,
    serviceIndex,
    service,
    deleteService,
    setService,
    setUpdateServiceMode,
}) => {
    const conditions = service.conditions.map((item, i) => {
        return item ? <li key = { i }>{item}</li> : null
    });

    const wallPaperUrl = fakeApi
        ? './uploads/ServicesWallpapers/service.jpg'
        : service.wallPaper
            ? `url(${API_URL}/serviceWallpapers/${service._id}/${service.wallPaper})`
            : './uploads/ServicesWallpapers/service.jpg';

    return (
        <li className="services__item">
            <span className={'services__item-index'}>{`0${serviceIndex}`}</span>
            <article className="services__article">
                { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
                    <div className={"actionBar"}>
                        <button
                            data-tooltip-id="service-tooltip"
                            data-tooltip-content="Edit service item"
                            className={"btn btn--icon"}
                            onClick={() => {
                                console.log("hit onclick!!!!!!!!!!!!")
                                setService(service);
                                setUpdateServiceMode(true);
                            }}
                        >
                            <svg><use href={`${Sprite}#edit`}/></svg>
                        </button>
                        <button
                            data-tooltip-id="service-tooltip"
                            data-tooltip-content="Delete service item"
                            className={"btn btn--icon"}
                            onClick={() => {deleteService(service._id)}}
                        >
                            <svg><use href={`${Sprite}#trash`}/></svg>
                        </button>
                    </div>
                }
                <div
                    className="services__article-img-wrap"
                    style={{ backgroundImage: `url(${wallPaperUrl})`}}
                >{''}</div>
                <div className="services__article-text-block">
                    <h4>{service.title}:</h4>
                    <ul className="services__item-list">
                        {conditions}
                    </ul>
                </div>
            </article>
            <Tooltip id="service-tooltip" />
        </li>
    )
});
