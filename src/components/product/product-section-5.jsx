import CardTypeC from '../cards/card-type-c';
import img1 from '../../assets/caterings/Catering-In-Riyadh-300x300.jpg'
import weddingCater from "../../assets/caterings/wedding-catering.jpg"
import vegNonveg from "../../assets/caterings/veg-nonveg.jpg"
import liveCounter from "../../assets/caterings/live-counter.jpg"
import customFood from "../../assets/caterings/custom-food.jpg"
import corporateCater from "../../assets/caterings/corporate-catering.jpg"
import buffetService from "../../assets/caterings/buffet-service.jpg"
import birthdayCater from "../../assets/caterings/birthday-catering.jpg"
import CardTypeA from '../cards/card-type-a';

const ProductSection5 = () => {
  const services = [
    {
      id: 1,
      name: "Wedding Catering",
      image: weddingCater,
      price: 120,
      rating: 4.8,
      slug_url: "wedding-catering"
    },
    {
      id: 2,
      name: "Corporate Catering",
      image: corporateCater,
      price: 100,
      rating: 4.6,
      slug_url: "corporate-catering"
    },
    {
      id: 3,
      name: "Birthday Catering",
      image: birthdayCater,
      price: 90,
      rating: 4.7,
      slug_url: "birthday-catering"
    },
    {
      id: 4,
      name: "Buffet Services",
      image: buffetService,
      price: 150,
      rating: 4.9,
      slug_url: "buffet-services"
    },
    {
      id: 5,
      name: "Live Counter Setup",
      image: liveCounter,
      price: 200,
      rating: 4.5,
      slug_url: "live-counter-setup"
    },
    {
      id: 6,
      name: "Veg & Non-Veg Packages",
      image: vegNonveg,
      price: 180,
      rating: 4.4,
      slug_url: "veg-nonveg-packages"
    },
    {
      id: 7,
      name: "Custom Menu Planning",
      image: customFood,
      price: 130,
      rating: 4.6,
      slug_url: "custom-menu-planning"
    },
  ];
  

  return (
    <CardTypeC
      title="Event-Catering"
      description="Explore our spiritual services"
      services={services}
      baseImageUrl={img1}
      themeColor="#d97706"
      ctaText="Book Now"

       section="Catering Events"
    sectionSlug="/event-catering/service"
    />
  );
};
export default ProductSection5;