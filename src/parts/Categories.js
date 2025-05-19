import Button from "elements/Button";
import React, { useEffect, useState } from "react";
import axios from "axios";

const PemesanList = () => {
  const [pemesan, setPemesan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Api/wisata");
        setPemesan(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <div className="row">
        {pemesan.length === 0 ? (
          <div className="col-auto align-items-center">
            There is no property in this list
          </div>
        ) : (
          pemesan.map((item) => (
            <div
              className="item column-3 row-1 col-md-4 mb-4"
              key={`item-${item.type}-item-${item.NamaTempat}`}
            >
              <div className="card">
                <div className="mb-3 font-weight-medium" style={{ width: "fit-content" }}>
                {item.type}
              </div>
                {item.Ispopular && (
                  <div className="tag">
                    Popular <span className="font-weight-light">Choice</span>
                  </div>
                )}
                <figure className="img-wrapper" style={{ height: 180 }}>
                  <img
                    src={item.Url_1 || ""}
                    alt={item.Kota}
                    className="img-cover"
                  />
                </figure>
                <div className="meta-wrapper">
                  <Button
                    type="link"
                    className="stretched-link d-block text-gray-800"
                    href={`/properties/${item.id_paket}`}
                  >
                    <h5 className="h4">{item.NamaTempat}</h5>
                  </Button>
                  <span className="text-gray-500">
                    {item.Kota}, Indonesia
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PemesanList;