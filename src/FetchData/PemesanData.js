import React, { useEffect, useState } from "react";
import axios from "axios";

const PemesanList = () => {
  const [pemesan, setPemesan] = useState([]); // State to store data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch data from the API
  useEffect(() => {
    const fetchPemesan = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/pemesan");
        setPemesan(response.data.data); // Set the data from the API
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPemesan();
  }, []); // Empty dependency array ensures this runs only once

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the list of pemesan
  return 
};

export default PemesanList;