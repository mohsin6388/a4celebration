import React from 'react';
import Slider from '../components/slider/Slider';
import Service from '../components/service/Service';
import AvailableCities from '../components/service/AvailableCities';
import AboutDetails from '../components/service/AboutDetails';
import Banner1 from '../components/banner/banner1';
import FeaturedServices from '../components/cards/card-type-a';
import MyComponent from '../components/product/product-section-1';
import ProductSection2 from '../components/product/product-section-2';
import ProductSection1 from '../components/product/product-section-1';
import Banner2 from '../components/banner/banner2';
import ProductSection3 from '../components/product/product-section-3';
import ProductSection4 from '../components/product/product-section-4';
import Banner3 from '../components/banner/banner3';
import ProductSection5 from '../components/product/product-section-5';
import ProductSection6 from '../components/product/product-section-6';
import WhyChooseUs from '../components/service/WhyChooseUs';
import CustomerReviewSlider from '../components/service/CustomerReviewSlider';
import MetaTags from '../components/SEO/MetaTags';
import Banner4 from '../components/banner/banner4';
import Banner5 from '../components/banner/banner5';




const Home = () => {
  
   

  return (
    <>
      <div className='bg-yellow-50'>

        <MetaTags
          title="Best Event Planners in Kanpur"
          description="Top birthday, wedding, and corporate event organizers in Kanpur."
          keywords="Best Event Planners in Kanpur, Birthday Decoration, Wedding Event Management, Corporate Events"
        />
        <Slider></Slider>
        <Service></Service>
        <AvailableCities></AvailableCities>
        <AboutDetails></AboutDetails>
        <Banner1></Banner1>
        <ProductSection1></ProductSection1>
          <Banner2 ></Banner2>
        <ProductSection2></ProductSection2>
        <Banner4></Banner4>
      
        <ProductSection6></ProductSection6>
        <Banner5></Banner5>
        
         <ProductSection3></ProductSection3>
        <Banner3></Banner3>
       
        <ProductSection5></ProductSection5>

        <CustomerReviewSlider></CustomerReviewSlider>
        <WhyChooseUs></WhyChooseUs>

      </div>





    </>
  );
}

export default Home;
