import CardTypeB from '../cards/card-type-b';
import img1 from '../../assets/artist/nikhil-artist.jpg';
import { useContext, useEffect } from 'react';
import ArtistContext from '../../context/ArtistContext';
import ArtistCardA from '../cards/Artist-card(a)';
import ArtistCardB from '../cards/Artist-card(a)';

const ProductSection3 = () => {
  const { artists, getArtists } = useContext(ArtistContext);

  // Fetch artists on component mount
  useEffect(() => {
    getArtists();
  }, []);

  return (
    <ArtistCardA
      title="Artist-Management"
      description="Explore our spiritual services"
      artists={artists}  
      
      themeColor="#d97706"
      ctaText="Book Now"
      section="Artist Booking"
      sectionSlug="/artist/service"
    />
  );
};

export default ProductSection3;
