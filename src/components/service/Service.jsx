import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { fetchCategories } from '../../redux/categoriesSlice'
import { useEffect } from "react"
import { API } from "../../utils/api"

const Services = () => {
  const dispatch = useDispatch()
  const { categories, loading, error } = useSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  console.log("Data ke Saaath iamge aa gyi hia =>", categories);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  }

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  const getImageUrl = (imagePath) => {
  return imagePath
    ? `${API}${imagePath}`
    : "/placeholder.svg";
}


  if (loading) {
    return (
      <section className="bg-gradient-to-b from-amber-50 to-amber-100 py-16 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <p>Loading categories...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-amber-50 to-amber-50 py-16 px-4">
        <div className="container mx-auto max-w-7xl text-center text-red-500">
          <p>Error loading categories: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-b from-amber-50 to-amber-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div
              key={category._id}
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <Link to={`/${category.slug_url}`} className="block h-full">
                <div className="bg-amber-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col max-w-[280px] mx-auto w-full border border-amber-200">
                  {/* Image Container (unchanged) */}
                  <div className="relative overflow-hidden aspect-square p-3 pt-4 bg-gradient-to-br from-amber-100 to-amber-50">
                    <motion.div
                      className="w-full h-full"
                      variants={imageVariants}
                    >
                      <img
                        src={getImageUrl(category.category_image)}
                        alt={category.category_name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </motion.div>


                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-amber-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 m-3 rounded-2xl"
                      variants={overlayVariants}
                      initial="initial"
                    >
                      <span className="text-amber-100 font-medium flex items-center gap-1 px-4 py-2 rounded-full bg-amber-900/60 backdrop-blur-sm border border-amber-700/50">
                        View Details <ChevronRight size={16} />
                      </span>
                    </motion.div>
                  </div>

                  {/* Category Name Container - Now with dynamic font sizing */}
                  <div className="px-2 py-2 min-h-[40px] flex items-center justify-center border-t border-amber-200 bg-amber-50">
                    <p
                      className="
            text-[0.6rem] xs:text-[0.25rem] sm:text-[0.7rem] 
            font-semibold text-amber-900 uppercase 
            text-center w-full px-1
            break-all whitespace-normal
            leading-[1.15] tracking-tight
          "
                    >
                      {category.category_name}
                    </p>
                  </div>

                  {/* Popular badge (unchanged) */}
                  {category.status === "1" && (
                    <div className="absolute top-5 right-5 z-10">
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-amber-50 text-[10px] px-2 py-0.5 rounded-full font-medium shadow-md border border-amber-600/50">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}

export default Services