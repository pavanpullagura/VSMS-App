import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './GalleryCarousel.css';
import axios from 'axios';

const GalleryCarousel = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [popupImages, setPopupImages] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/staff/gallery-categories/')
            .then(resp => {
                setCategories(resp.data);
                console.log('API response:', resp.data); // Check the structure here
            })
            .catch(error => console.error('error', error));
    }, []);

    const handleCarouselClick = (category) => {
        setSelectedCategory(category);
        console.log('Image clicked', category);
        axios.get(`http://127.0.0.1:8000/staff/gallery-images/${category.id}/`)
            .then(resp => {
                setPopupImages(resp.data);
                setShowPopup(true);
                console.log(resp.data)
            })
            .catch(error => console.error(error));
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <Carousel>
                {categories.map((category) => (
                    <div key={category.id}>
                        {category.galleryimages_set && category.galleryimages_set.length > 0 ? (
                            <div onClick={() => handleCarouselClick(category)} className='carousel_image_thumb_div'>
                                <img
                                src={category.galleryimages_set[0].image}
                                alt={category.galleryimages_set[0].description || 'No description'}
                            />
                            </div>
                        ) : (
                            <div>No images available</div>
                        )}
                        <p>{category.category_name}</p>
                    </div>
                ))}
            </Carousel>
            {showPopup && (
                <div className="carousel_popup">
                    <div className="popup-content">
                        <h2>{selectedCategory.category_name}</h2>
                        <div className="popup-images">
                            {popupImages.length > 0 ? (
                                popupImages.map((pImg) => (
                                    <img key={pImg.id} src={`http://127.0.0.1:8000/${pImg.image}`} alt={pImg.description || 'No description'} />
                                ))
                            ) : (
                                <div>No images available</div>
                            )}
                        </div>
                        <button onClick={handleClosePopup} className="close">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryCarousel;
