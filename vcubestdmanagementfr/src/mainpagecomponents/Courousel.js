import { Swiper, SwiperSlide } from "swiper/react";
import {EffectCoverflow, Pagination} from "swiper/modules";
import "./Carousel.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import image1 from '../images/21693391.jpg';
import image2 from '../images/42153245.jpg';
import image3 from '../images/best-background-for-website-13.jpg';
import image4 from '../images/orane spectral line2.jpg';

const slides = [
    {
        title:"1 Series",
        image: image1,
    },
    {
        title:"2 Series",
        image: image2,
    },
    {
        title:"3 Series",
        image: image3,
    },
    {
        title:"4 Series",
        image: image4,
    }
];

export const Carousel = () =>(
    <Swiper
    grabCursor
    centeredSlides
    slidesPerView={2}
    loop
    pagination
    coverflowEffect={{
        rotate:0,
        stretch:0,
        depth:100,
        modifier:3,
        slideShadows:true,
    }}
    modules={[Pagination, EffectCoverflow]}
    >
        {slides.map(slide =>(
            <SwiperSlide
            style={{
                backgroundImage:`url(${slide.image})`,
            }}
            >
                <div>
                    <div>
                        <h2>{slide.title}</h2>
                        <a>explore</a>
                    </div>
                </div>
            </SwiperSlide>
        ))}
    </Swiper>
) 