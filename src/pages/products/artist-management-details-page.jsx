import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import ArtistContext from '../../context/ArtistContext';
import img1 from '../../assets/coming-soon-funny-cartoon-workers-600nw-524317576.webp';
import { FaYoutube, FaSpotify, FaCalendarAlt, FaMapMarkerAlt, FaStar, FaMusic, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingModal from './BookingModal'; // We'll create this component
import { API } from '../../utils/api';

const ArtistManagementDetailsPage = () => {
  const { slug } = useParams();
  const { singleArtist, getArtistBySlug } = useContext(ArtistContext);
  const [showVideo, setShowVideo] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (slug) {
      getArtistBySlug(slug);
    }
  }, [slug]);

  // Extract YouTube ID from URL
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleVideoClick = (url) => {
    setYoutubeUrl(url);
    setShowVideo(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    toast.success('Booking request submitted successfully! We will contact you shortly.');
  };

  const handleBookingError = (error) => {
    toast.error(error || 'There was an error submitting your request. Please try again.');
  };

  if (!singleArtist) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <img src={img1} alt="Coming soon" className="mx-auto max-w-md" />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">Loading artist details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* Hero Section */}
        <div className="relative h-100 bg-gray-900">
          <img
            // src={"https://a4celebration.com/api/" + singleArtist.featured_image || img1}
            src={
              `${API}api/${singleArtist.featured_image}` ||
              img1
            }
            alt={singleArtist.name}
            className="w-full h-full object-contain opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {singleArtist.name}
                </h1>
                <p className="text-xs text-gray-300">
                  {singleArtist.category_name}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${singleArtist.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {singleArtist.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mb-4 text-center">
          {/* Description Section */}
          {singleArtist.description &&
            singleArtist.description !== "<p><br></p>" && (
              <div className=" text-left bg-gray-100 p-3 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  About the Artist
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {singleArtist.description.replace(/<[^>]*>/g, "")}
                </p>
              </div>
            )}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-4 p-4">
          {/* Left Column - Artist Info */}
          <div className="md:col-span-2 space-y-4">
            {/* Categories & Genres */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h2 className="text-sm font-semibold mb-2 flex items-center text-gray-800">
                  <FaStar className="mr-1 text-gray-700 text-xs" />
                  Categories
                </h2>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                    {singleArtist.category_name}
                  </span>
                  {singleArtist.child_categories?.map((cat) => (
                    <span
                      key={cat._id}
                      className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h2 className="text-sm font-semibold mb-2 text-gray-800">
                  <FaMusic className="mr-1 inline text-xs" />
                  Genres
                </h2>
                <div className="flex flex-wrap gap-1">
                  {singleArtist.genre?.length > 0 ? (
                    singleArtist.genre.map((g, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs"
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">
                      No genres specified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Experience Meter */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h2 className="text-sm font-semibold mb-2 text-gray-800">
                Performance Experience
              </h2>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-xs text-gray-700">
                    Years in Industry
                  </span>
                  <span className="font-bold text-xs text-gray-900">
                    {singleArtist.experience} years
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-800 h-2 rounded-full"
                    style={{
                      width: `${Math.min(singleArtist.experience * 10, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Event Types & Cities */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h2 className="text-sm font-semibold mb-2 flex items-center text-gray-800">
                  <FaCalendarAlt className="mr-1 text-gray-600 text-xs" />
                  Event Types
                </h2>
                {singleArtist.type_of_events?.length > 0 ? (
                  <ul className="space-y-1">
                    {singleArtist.type_of_events.map((event, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-1"></span>
                        <span className="text-xs text-gray-700">{event}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">
                    No event types specified
                  </p>
                )}
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h2 className="text-sm font-semibold mb-2 flex items-center text-gray-800">
                  <FaMapMarkerAlt className="mr-1 text-gray-600 text-xs" />
                  Available Cities
                </h2>
                <div className="flex flex-wrap gap-1">
                  {singleArtist.available_cities?.length > 0 ? (
                    singleArtist.available_cities.map((city, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs"
                      >
                        {city}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">
                      No cities specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking & Media */}
          <div className="space-y-4">
            {/* Booking CTA */}
            <div className="bg-gray-900 p-4 rounded-lg text-white">
              <h2 className="text-lg font-bold mb-2">Book This Artist</h2>
              <p className="mb-3 text-xs text-gray-300">
                Make your event unforgettable with {singleArtist.name}'s
                performance!
              </p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-white text-gray-900 font-bold py-2 px-3 rounded text-sm hover:bg-gray-100 transition duration-300"
              >
                Book Now
              </button>
            </div>

            {/* Media Links */}
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h2 className="text-sm font-semibold mb-2 text-gray-800">
                Media & Links
              </h2>
              <div className="space-y-2">
                {singleArtist.content_links?.length > 0 ? (
                  singleArtist.content_links.map((link, i) => (
                    <div key={i}>
                      {link.includes("youtube") ? (
                        <button
                          onClick={() => handleVideoClick(link)}
                          className="flex items-center text-gray-800 hover:text-gray-600 transition w-full text-left"
                        >
                          <FaYoutube className="mr-1 text-gray-600 text-sm" />
                          <span className="text-xs truncate">Watch Video</span>
                        </button>
                      ) : (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-800 hover:text-gray-600 transition"
                        >
                          <FaSpotify className="mr-1 text-gray-600 text-sm" />
                          <span className="text-xs truncate">
                            {new URL(link).hostname.replace("www.", "")}
                          </span>
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">
                    No media links available
                  </p>
                )}
              </div>
            </div>

            {/* YouTube Video Modal */}
            {showVideo && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg overflow-hidden w-full max-w-2xl">
                  <div className="p-2 flex justify-between items-center bg-gray-800 text-white">
                    <span className="text-sm">Video Preview</span>
                    <button
                      onClick={() => setShowVideo(false)}
                      className="text-white hover:text-gray-300"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube video"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && (
              <BookingModal
                artist={singleArtist}
                onClose={() => setShowBookingModal(false)}
                onSuccess={handleBookingSuccess}
                onError={handleBookingError}
              />
            )}

            {/* Gallery */}
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <h2 className="text-sm font-semibold mb-2 text-gray-800">
                Performance Gallery
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {singleArtist.other_images?.length > 0 ? (
                  singleArtist.other_images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group overflow-hidden rounded"
                    >
                      <img
                        src={img}
                        alt={`${singleArtist.name} gallery ${i + 1}`}
                        className="w-full h-24 object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    <FaMusic className="text-2xl mx-auto mb-1 opacity-50" />
                    <p className="text-xs">No gallery images available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistManagementDetailsPage;