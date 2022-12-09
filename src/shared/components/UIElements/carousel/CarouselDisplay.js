import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import './CarouselDisplay.css';

export const dummyData = [
 {
   Id: 1,
   subject: 'Managing your league has never been easier.',
   tagline: '',
   image: 'https://img.photographyblog.com/reviews.jpg',
 },
 {
  Id: 2,
  subject: 'Design your league the way you want to.',
  tagline: '',
  image: 'https://img.photographyblog.com/reviews.jpg',
 },
 {
  Id: 3,
  subject: 'Real time analytics.',
  tagline: '',
  image: 'https://img.photographyblog.com/reviews.jpg',
 },
 {
    Id: 4,
    subject: 'Track events, standings, incidents.',
    tagline: '',
    image: 'https://img.photographyblog.com/reviews.jpg',
  },
  {
   Id: 5,
   subject: 'Use your league members to assist your efforts.',
   tagline: '',
   image: 'https://img.photographyblog.com/reviews.jpg',
  },
  {
   Id: 6,
   subject: 'And theres a lot more to come...',
   tagline: '',
   image: 'https://img.photographyblog.com/reviews.jpg',
  }
]

export const CarouselDisplay = (props) => {

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const productTemplate = (feature) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <div className="mb-3">
                        <img src={`images/product/${feature.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={feature.name} className="product-image" />
                    </div>
                    <div>
                        <p className="mb-1">{feature.subject}</p>
                        <div className="car-buttons mt-5">
                            <Button style={{margin:'1%'}} icon="pi pi-search" className="p-button p-button-rounded mr-2" />
                            <Button style={{margin:'1%'}} icon="pi pi-star-fill" className="p-button-success p-button-rounded mr-2" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="carousel-demo">
            <Carousel value={dummyData} numVisible={2} numScroll={1} responsiveOptions={responsiveOptions} className="custom-carousel" circular
                autoplayInterval={3000} itemTemplate={productTemplate} header={<h3 style={{color:'white', textAlign:'center', margin: '5%'}}>Features</h3>} />
        </div>
    );
};