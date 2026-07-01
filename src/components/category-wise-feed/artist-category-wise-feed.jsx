import React, { useContext, useEffect, useMemo } from 'react';
import ArtistContext from '../../context/ArtistContext';
import ArtistCardB from '../cards/Artist-Card(b)';
import { useParams } from 'react-router-dom';



const ArtistCategoryWiseFeed = () => {
  const { artists, getArtists } = useContext(ArtistContext);
  const { slug } = useParams();

  // Fetch artists on component mount
  useEffect(() => {
    getArtists();
  }, []);

  // Filter artists based on slug matching childCategoryId
  const filteredArtists = useMemo(() => {
    if (!slug || !artists) return artists;
    
    return artists.filter(artist => {
      if (!artist.child_categories) return false;
      
      return artist.child_categories.some(childCategory => {
        const normalizedName = childCategory.name.toLowerCase().replace(/\s+/g, '-').trim();
        return normalizedName === slug.toLowerCase();
      });
    });
  }, [artists, slug]);


  return (
    <ArtistCardB
      title={slug ? `${slug.replace(/-/g, ' ')} Artists` : "All Artists"}
      description={slug ? `Explore our ${slug.replace(/-/g, ' ')} artists` : "Explore our talented artists"}
      artists={filteredArtists}  
      themeColor="#d97706"
      ctaText="Book Now"
      section="Artist Booking"
      sectionSlug="/artist/service"
    />
  );
}

export default ArtistCategoryWiseFeed;

