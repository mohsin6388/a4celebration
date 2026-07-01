
import CardTypeA from "../cards/card-type-a";
import img1 from '../../assets/decoration/1687938112_original.avif'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, removeProduct } from '../../redux/productSlice';
import { useEffect } from "react";


const ProductSection1 = () => {



  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  console.log("current work ==> ",products)

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);



  return (
    <CardTypeA
      title="Decorations"
      description="Explore our spiritual services"
      services={products}
      baseImageUrl={img1}
      themeColor="#d97706"
      
      section="Decorations"
      sectionSlug="/decorations/service"
      ctaText="Book Now"
     
    />
  );
};
export default ProductSection1;
