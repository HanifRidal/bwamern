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
        const response = await axios.get(
          "http://localhost:3000/Api/Wisata/Type"
        );
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

  // Group items by type
  const groupedByType = pemesan.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const typeKeys = Object.keys(groupedByType);

  return (
    <div className="container">
      <div className="row">
        {typeKeys.length === 0 ? (
          <div className="col-auto align-items-center">
            There is no property in this list
          </div>
        ) : (
          typeKeys.map((type) => (
            <React.Fragment key={type}>
              <div className="col-12 mb-1">
                <div
                  className="mb-1 font-weight-medium"
                  style={{ width: "fit-content" }}
                >
                  <h5 className="mb-2">{type}</h5>
                </div>
              </div>
              {groupedByType[type].map((item) => (
                <div
                  className="item column-3 row-1 col-md-4 mb-4"
                  key={`item-${item.type}-item-${item.NamaTempat}`}
                >
                  <div className="card">
                    {item.Ispopular && (
                      <div className="tag">
                        Popular{" "}
                        <span className="font-weight-light">Choice</span>
                      </div>
                    )}
                    <figure className="img-wrapper" style={{ height: 180 }}>
                      <img
                        src={item.ImgUrl || ""}
                        alt={item.Kota}
                        className="img-cover"
                      />
                    </figure>
                    <div className="meta-wrapper">
                      <Button
                        type="link"
                        className="stretched-link d-block text-gray-800"
                        href={`/properties/${item.TujuanID}`}
                      >
                        <h5 className="h4">{item.NamaTempat}</h5>
                      </Button>
                      <span className="text-gray-500">
                        {item.Kota}, Indonesia
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default PemesanList;
