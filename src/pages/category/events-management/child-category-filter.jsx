import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../redux/productSlice';
import { useEffect, useMemo } from "react";
import { fetchCategories } from '../../../redux/categoriesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { eventManagement } from "../../../utils/filterImages"

const ChildCategoryFilter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Find the EventManagement category
  const EventManagementCategory = useMemo(() => {
    return categories.find(cat => cat.category_name === "Event Management");
  }, [categories]);

  // Get child categories as an array
  const childCategories = useMemo(() => {
    if (!EventManagementCategory || !EventManagementCategory.child_category) return [];
    return Object.entries(EventManagementCategory.child_category).map(([id, data]) => ({
      id,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      image: data.image
    }));
  }, [EventManagementCategory]);

  // Set active category based on URL slug
  const activeCategory = useMemo(() => {
    if (!slug || !childCategories.length) return null;
    return childCategories.find(child => child.slug === slug)?.id || null;
  }, [slug, childCategories]);

  const handleCategoryClick = (childSlug, childId) => {
    if (activeCategory === childId) {
      // Deselect if clicking the active category
      navigate('/event-management');
    } else {
      // Select the new category
      navigate(`/event-management/${childSlug}`);
    }
  };

  if (!EventManagementCategory) return null;

  console.log("event ka msla", childCategories)

  return (
    <div className="py-3">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Event Management Categories
      </h3>

      <div className="relative">
        <div className="flex space-x-6   overflow-x-auto scrollbar-hide ">
          {eventManagement.map((child) => (
            <div
              key={child.id}
              onClick={() => handleCategoryClick(child.slug, child.id)}
              className="flex flex-col items-center min-w-max cursor-pointer transition-all duration-200 hover:-translate-y-1"
            >
              <div
                className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-2 overflow-hidden
                ${
                  activeCategory === child.id
                    ? "ring-2 ring-amber-500 shadow-lg shadow-amber-200/50"
                    : "bg-white border border-gray-200 shadow-sm"
                }
                transition-all duration-300
              `}
              >
                {child.image ? (
                  <img
                    // src={"https://a4celebration.com/api/" + child.image}
                    src={child.image}
                    alt={child.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className={`
                    text-xl font-bold 
                    ${activeCategory === child.id ? "text-white bg-gradient-to-br from-amber-400 to-amber-600 w-full h-full flex items-center justify-center" : "text-gray-600"}
                  `}
                  >
                    {child.name.charAt(0)}
                  </span>
                )}
              </div>
              <span
                className={`
                text-xs text-center max-w-[80px] truncate
                ${activeCategory === child.id ? "text-amber-600 font-medium" : "text-gray-600"}
              `}
              >
                {child.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChildCategoryFilter;