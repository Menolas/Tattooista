import * as React from "react";
import { NavLink } from "react-router-dom";
import "react-alice-carousel/lib/alice-carousel.css";
import { StyleType } from "../../types/Types";
import {API_URL} from "../../http";
import {MyCarousel} from "../common/MyCarousel";
import {useEffect, useState} from "react";

type PropsType = {
    activeStyle: StyleType | null;
    pageSize: number;
    styles: Array<StyleType>;
    setActiveStyle: (style: StyleType) => void;
}

const responsive = {
    0: {
        items: 1,
        itemsFit: 'contain',
    },
    600: {
        items: 2,
        itemsFit: 'contain',
    },
    900: {
        items: 3,
        itemsFit: 'contain',
    },
    1400: {
        items: 4,
        itemsFit: 'contain',
    },
}

export const PortfolioSlider: React.FC<PropsType> = React.memo(({
  activeStyle,
  pageSize,
  styles,
  setActiveStyle,
}) => {

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const newActiveIndex = styles.findIndex(slide => slide._id === activeStyle?._id);
    setActiveIndex(newActiveIndex);
  }, [activeStyle, styles]);

  const slides = styles?.map((slide) => {

    if (slide.wallPaper) {
        const wallpaperUrl = `${API_URL}/styleWallpapers/${slide._id}/${slide.wallPaper}`;

        return (
            <div
                className="slider-item"
                key={slide._id}
            >
                <NavLink
                    to={`/portfolio/${slide._id}`}
                    className="portfolio-slider__link"
                    style={{backgroundImage: `url(${wallpaperUrl})`}}
                    onClick={() => {
                        setActiveStyle(slide);
                    }}
                >
                    <div className={'slider-item-title__wrap'}>
                        <h4 className="slider-item-title">{slide.value}</h4>
                    </div>
                </NavLink>
            </div>
        )
    } else {
        return null;
    }
  }).filter(slide => slide !== null);

    return (
      <section className="page-block portfolio-slider container">
          <h2 className="page-block__title">Portfolio</h2>
          <MyCarousel
              activeIndex={activeIndex}
              items={slides}
              responsive={responsive}
              controlsStrategy={"alternate"}
          />
      </section>
  );
});

PortfolioSlider.displayName = 'PortfolioSlider';
