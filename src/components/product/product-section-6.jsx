import CardTypeC from '../cards/card-type-c';
import img1 from '../../assets/events/1664351665_original.avif'
import CardTypeA from '../cards/card-type-a';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, removeEvent } from '../../redux/eventManagementSlice';
import { useEffect } from 'react';

const ProductSection6 = () => {
  // const services = [
  //   {
  //     id: 1,
  //     name: "Wedding Planning",
  //     image: img1,
  //     price: 500,
  //     rating: 4.8,
  //     slug: "event-management"
  //   },
  //   {
  //     id: 2,
  //     name: "Corporate Events",
  //     image: img1,
  //     price: 400,
  //     rating: 4.6,
  //     slug: "event-management"
  //   },
  //   {
  //     id: 3,
  //     name: "Birthday Parties",
  //     image: img1,
  //     price: 250,
  //     rating: 4.7,
  //     slug: "event-management"
  //   },
  //   {
  //     id: 4,
  //     name: "Cultural Events",
  //     image: img1,
  //     price: 300,
  //     rating: 4.5,
  //     slug: "event-management"
  //   },
  //   {
  //     id: 5,
  //     name: "Concert Management",
  //     image: img1,
  //     price: 800,
  //     rating: 4.9,
  //     slug: "event-management"
  //   },
  //   {
  //     id: 6,
  //     name: "Exhibition Stalls",
  //     image: img1,
  //     price: 350,
  //     rating: 4.4,
  //     slug: "event-management"
  //   },
  //   {
  //     id: 7,
  //     name: "Product Launches",
  //     image: img1,
  //     price: 600,
  //     rating: 4.7,
  //     slug: "event-management"
  //   },
  // ];



  // const services = [
  //   {
  //     id: 1,
  //     name: "Wedding Planning",
  //     image: img1,
  //     price: 500,
  //     rating: 4.8,
  //     slug: "event-management"
  //   },
  //   {
  //     id: 2,
  //     name: "Corporate Events",
  //     image: img1,
  //     price: 400,
  //     rating: 4.6,
  //     slug: "event-management"
  //   },
    
  // ];
  


   const dispatch = useDispatch();
 
  const { events, loading, error } = useSelector((state) => state.events);
 

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);


  return (
    <CardTypeC
      title="event-management"
      description="Explore our spiritual services"
      services={events}
      baseImageUrl={img1}
      themeColor="#d97706"
      ctaText="Book Now"
      section="Event Management"
    sectionSlug="/event-management/service"
    />
  );
};
export default ProductSection6;