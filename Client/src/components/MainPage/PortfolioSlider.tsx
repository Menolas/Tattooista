import * as React from "react";
import { NavLink } from "react-router-dom";
import "react-alice-carousel/lib/alice-carousel.css";
import { StyleType } from "../../types/Types";
import {API_URL} from "../../http";
import {MyCarousel} from "../common/MyCarousel";

type PropsType = {
    fakeApi: boolean;
    galleryPageSize: number;
    styles: Array<StyleType>;
    setActiveStyle: (style: StyleType) => void;
}

const responsive = {
    0: { items: 1 },
    600: { items: 2 },
    900: { items: 3 },
    1400: { items: 4 },
}

export const PortfolioSlider: React.FC<PropsType> = React.memo(({
  fakeApi,
  galleryPageSize,
  styles,
  setActiveStyle
}) => {

  const sliders = styles?.map((slider) => {

     const wallpaperUrl = fakeApi
         ? `./uploads/TattooStylesWallpapers/${slider.wallPaper}`
         : `${API_URL}/styleWallpapers/${slider._id}/${slider.wallPaper}`;

     return (
         <div
             className="slider-item"
             key={slider._id}
         >
             <NavLink
                 to={`/portfolio?&style=${slider.value}&page=1&limit=${galleryPageSize}`}
                 className="portfolio-slider__link"
                 style={{backgroundImage: `url(${wallpaperUrl})`}}
                 onClick={() => {
                     setActiveStyle(slider);
                 }}
             >
                 <div className={'slider-item-title__wrap'}>
                     <h4 className="slider-item-title">{slider.value}</h4>
                 </div>
             </NavLink>
         </div>
     )
  });

    return (
      <section className="page-block portfolio-slider container">
          <h2 className="page-block__title">Portfolio</h2>
          <MyCarousel
              items={sliders}
              responsive={responsive}
              controlsStrategy={"alternate"}
          />
      </section>
  )
});
