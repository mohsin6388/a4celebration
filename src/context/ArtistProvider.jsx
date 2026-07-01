import axios from 'axios';
import ArtistContext from './ArtistContext';
import { useState } from 'react';
import { API } from "../utils/api";

function ArtistProvider({ children }) {
  const token = import.meta.env.VITE_API_KEY;
  const [artists, setArtists] = useState([]);
  const [singleArtist, setSingleArtist] = useState(null); // store one artist

  // Get all artists
  async function getArtists() {
    try {
      // const { data } = await axios.get('https://a4celebration.com/api/api/artist/get/artist',
      const { data } = await axios.get(`${API}api/api/artist/get/artist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );
      setArtists(data.data);
    } catch (error) {
      console.log('Error while getting data', error);
    }
  }

  // Get artist by slug
  async function getArtistBySlug(slug) {
    try {
      const { data } = await axios.get(
        `${API}api/api/artist/slug/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSingleArtist(data.data);
    } catch (error) {
      console.log('Error while getting artist by slug', error);
    }
  }

  // Add new artist
  async function addArtists(artistData) {
    try {
      const response = await axios.post(
        `${API}api/api/artist/create`,
        artistData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          Authorization: `Bearer ${token}`,
        },
      );
      setArtists([...artists, response.data.data]);
    } catch (error) {
      console.log('Error while adding data', error);
    }
  }

  // Update artist
  async function updateArtist(id, artistData) {
    try {
      const response = await axios.put(
        `${API}api/api/artist/update/artist/${id}`,
        artistData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setArtists(
        artists.map((a) => (a._id === id ? response.data.data : a))
      );
    } catch (error) {
      console.log('Error while updating artist', error);
    }
  }

  // Delete artist
  async function deleteArtist(id) {
    try {
      await axios.delete(
        `${API}api/api/artist/remove/artist/${id}`,
        { Authorization: `Bearer ${token}` },
      );
      setArtists(artists.filter((a) => a._id !== id));
    } catch (error) {
      console.log('Error while deleting artist', error);
    }
  }

  return (
    <ArtistContext.Provider value={{
      artists,
      singleArtist,
      getArtists,
      getArtistBySlug,   // <-- added here
      addArtists,
      updateArtist,
      deleteArtist
    }}>
      {children}
    </ArtistContext.Provider>
  );
}

export default ArtistProvider;
