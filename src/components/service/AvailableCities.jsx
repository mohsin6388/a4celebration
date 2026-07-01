import { FaCheckCircle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import kanpur from '../../assets/Kanpur (1).png';
import { fetchProducts } from '../../redux/productSlice';

import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../redux/locationSlice";


 // Adjust path as needed

const AvailableCities = () => {


  const dispatch = useDispatch();
  const selectedCity = useSelector((state) => state.location.currentLocation);
console.log(selectedCity)
 const cities = [
    { name: "Kanpur", href: "/pandits/Kanpur", src:kanpur  },
    { name: "Delhi", href: "/pandits/Delhi", src: "https://pujapurohit.in/assets/images/cities/newdelhi.webp" },
    { name: "Noida", href: "/pandits/Noida", src: "https://firebasestorage.googleapis.com/v0/b/mongodb-asset/o/places%2Fnoida.png?alt=media&token=902ba55d-2469-40cd-9f10-b6f2672f8a10&_gl=1*vlbioo*_ga*MTE0NDIwNTUxMi4xNjU0MjY0Mzg0*_ga_CW55HF8NVT*MTY5NzcyMjAxNS4zNzYuMS4xNjk3NzIyNTM4LjYwLjAuMA.." },
    { name: "Gurugram", href: "/pandits/Gurugram", src: "https://firebasestorage.googleapis.com/v0/b/mongodb-asset/o/cities%2Fgurugram.png?alt=media&token=f860b4bf-c9a3-480b-9bac-e6b26f92e772" }
    
  ];


  const handleCityClick = (city) => {
    dispatch(setLocation(city.name));
    dispatch(fetchProducts())
  };

  return (
    <div className="flex bg-gradient-to-r from-amber-500 to-amber-600 w-full flex-wrap items-center justify-center md:px-8 px-2 py-6">
      <div className="md:flex items-center justify-center w-full">
        <div className="text-amber-50 text-center md:text-left mb-2 md:mb-0">
          <p className="md:flex md:flex-col">
            <span className="md:text-xl text-sm font-medium">We are</span>
            <span className="md:text-2xl text-lg font-bold">Available In</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center w-full">
          {cities.map((city, index) => {
            const isSelected = selectedCity === city.name;

            return (
              <div
                key={index}
                onClick={() => handleCityClick(city)}
                className={`relative cursor-pointer h-full w-24 md:w-32 flex flex-col justify-center items-center px-2 m-2 p-1 rounded-lg shadow-md transition duration-300
                  bg-amber-50 hover:shadow-lg border border-amber-200`}
              >
                <img
                  loading="lazy"
                  width="200"
                  height="200"
                  decoding="async"
                  className="rounded-lg h-14 w-34 object-contain"
                  src={city.src}
                />

                <p className="text-sm font-semibold mt-2 text-amber-900">
                  {city.name}
                </p>

                {isSelected && (
                  <FaCheckCircle className="absolute top-1 right-1 text-green-600 text-xl bg-amber-100 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ToastContainer 
        toastStyle={{
          backgroundColor: '#D4AF37',
          color: '#000',
          fontWeight: 'bold'
        }}
        progressStyle={{ background: 'rgba(0,0,0,0.3)' }}
      />
    </div>
  );
};

export default AvailableCities;
