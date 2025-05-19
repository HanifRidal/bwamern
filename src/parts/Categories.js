import Button from "elements/Button";
import React, { useEffect, useState } from "react";
import axios from "axios";

const PemesanList = () => {
  const [pemesan, setPemesan] = useState([]); // State to store data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/pemesan/wisata"
        );
        setPemesan(response.data.data); // Set the data to state
      } catch (error) {
        setError(error); // Set error if any
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error state
  }
  return (
    <>
      {pemesan.map((item) => (
        <section key={`category${item.id_paket}`} className="container">
          <h4 className="mb-3 font-weight-medium">{item.NamaTempat}</h4>
          <div className="container-grid">
            {item.id_paket === 0 ? (
              <div className="row">
                <div className="col-auto align-items-center">
                  There is noo property at this category
                </div>
              </div>
            ) : (
              <div
                className="item column-3 row-1"
                key={`item-${item.detail_wisata}-item-${item.detail_wisata}`}
              >
                <div className="card">
                  {item.isPopular && (
                    <div className="tag">
                      Popular <span className="font-weight-light">Choise</span>
                    </div>
                  )}
                  <figure className="img-wrapper" style={{ height: 180 }}>
                    <img
                      src={item.imageUrl || ""}
                      alt={item.detail_wisata}
                      className="img-cover"
                    />
                  </figure>
                  <div className="meta-wrapper">
                    <Button
                      type="link"
                      className="stretched-link d-block text-gray-800"
                      href={`/properties/${item.id_paket}`}
                    >
                      <h5 className="h4">{item.detail_wisata}</h5>
                    </Button>
                    <span className="text-gray-500">
                      {item.penginapan}, {item.bis}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
};

export default PemesanList;
