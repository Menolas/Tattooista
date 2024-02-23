import * as React from "react"
import { NavLink } from "react-router-dom"
import AliceCarousel from "react-alice-carousel"
import "react-alice-carousel/lib/alice-carousel.css"
import { TattooStyleType } from "../../types/Types"
import {API_URL} from "../../http"

type PropsType = {
    fakeApi: boolean
    galleryPageSize: number
    tattooStyles: Array<TattooStyleType>
    setActiveStyle: (style: TattooStyleType) => void
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
  tattooStyles,
  setActiveStyle
}) => {

  const sliders = tattooStyles?.filter(slider => slider.value !== "No Style").map((slider) => {
     const wallpaperUrl = fakeApi
         ? `./uploads/TattooStylesWallpapers/${slider.wallPaper}`
         : `${API_URL}/styleWallpapers/${slider._id}/${slider.wallPaper}`
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
                     setActiveStyle(slider)
                 }}
             >
                 <div className={'slider-item-title__wrap'}>
                     <h4 className="slider-item-title">{slider.value}</h4>
                 </div>
             </NavLink>
         </div>
     )
  })

    return (
      <section className="page-block portfolio-slider container">
          <h2 className="page-block__title">Portfolio</h2>
          <AliceCarousel
              items={sliders}
              responsive={responsive}
              controlsStrategy={"alternate"}
              mouseTracking
          />
      </section>
  )
})
