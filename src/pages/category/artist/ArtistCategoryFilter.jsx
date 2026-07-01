import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from "react";
import { fetchCategories } from '../../../redux/categoriesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { artistManagement } from "../../../utils/filterImages"

const ArtistCategoryFilter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { categories } = useSelector((state) => state.categories);
  

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Find the artists category - using "Artist Management" as per your code
  const artistsCategory = useMemo(() => {
    return categories.find(cat => cat.category_name === "Artist Management");
  }, [categories]);


  // Get child categories as an array
  const artistCategories = useMemo(() => {
    if (!artistsCategory || !artistsCategory.child_category) return [];
    return Object.entries(artistsCategory.child_category).map(([id, data]) => ({
      id,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      image: data.image
    }));
  }, [artistsCategory]);

  // Set active category based on URL slug
  const activeCategory = useMemo(() => {
    if (!slug || !artistCategories.length) return null;
    return artistCategories.find(category => category.slug === slug)?.id || null;
  }, [slug, artistCategories]);

  const handleCategoryClick = (categorySlug, categoryId) => {
    if (activeCategory === categoryId) {
      // Deselect if clicking the active category
      navigate('/artists');
    } else {
      // Select the new category
      navigate(`/artists/${categorySlug}`);
    }
  };

  if (!artistsCategory) return null;

  console.log("Artist ===> ", artistCategories)

  return (
    <div className="py-3 mb-0">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Artist Categories</h3>

      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
          {artistManagement.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.slug, category.id)}
              className="flex flex-col items-center min-w-max cursor-pointer transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-2 overflow-hidden
                ${activeCategory === category.id
                  ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-200/50'
                  : 'bg-white border border-gray-200 shadow-sm'}
                transition-all duration-300
              `}>

                {console.log(category)}
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    
                  />
                ) : (
                  <span className={`
                    text-xl font-bold 
                    ${activeCategory === category.id ? 'text-white bg-gradient-to-br from-amber-400 to-amber-600 w-full h-full flex items-center justify-center' : 'text-gray-600'}
                  `}>
                    {category.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className={`
                text-xs text-center max-w-[80px] truncate
                ${activeCategory === category.id ? 'text-amber-600 font-medium' : 'text-gray-600'}
              `}>
                {category.name}
              </span>
            </div>
          ))}
        </div>

        {/* Gradient fade effect on sides */}
      
      </div>
    </div>
  );
}

export default ArtistCategoryFilter;