import React from 'react';
import CategoryTopBanner from './category-top-banner';
import CategoryWiseFilter from './CategoryWiseFilter';
import CategoryWiseProduct from './category-wise-product';
import ProductSection1 from '../../../components/product/product-section-1'
import CategoryWiseFeed from '../../../components/category-wise-feed/decoration-category-wise-feed';
import img1 from '../../../assets/coming-soon-funny-cartoon-workers-600nw-524317576.webp';
import ArtistCategoryFilter from './ArtistCategoryFilter'
import ArtistCategoryWiseFeed from '../../../components/category-wise-feed/artist-category-wise-feed';
const Artist = () => {
  return (
    
       <>
        <div className="w-full  px-4"> {/* Removed 'container mx-auto' */}
        <CategoryTopBanner />

        <div className="col-span-12">
        <ArtistCategoryFilter></ArtistCategoryFilter>
        </div>

        <div className="col-span-12">
          <ArtistCategoryWiseFeed></ArtistCategoryWiseFeed>
        </div>
      </div>
       </>
  );
};

export default Artist;
