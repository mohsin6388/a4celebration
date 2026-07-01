import React, { useEffect } from 'react';
import useGiftHook from '../../hooks/useGiftHooks';
import CardTypeB from "../cards/card-type-b";
import { useSelector } from 'react-redux';
const ProductSection2 = () => {

  const selectedCity = useSelector((state) => state.location.currentLocation); 
  const { giftList, giftLoading, giftError, fetchGifts } = useGiftHook();

  console.log("gift ki details", giftList)

  useEffect(() => {
    fetchGifts();
  }, [selectedCity]);

  // Transform the giftList data to match the expected format in CardTypeB
  

  return (
    <CardTypeB
      title="Giftings"
      description="Explore our Gifting Section"
      services={giftList}
      themeColor="#d97706"
      section="Giftings"
      sectionSlug="/gifts/e-commerce"
      ctaText="Buy Now"
    />
  );
};

export default ProductSection2;