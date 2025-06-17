import React from "react";
import itemDetails from "json/itemDetails.json";

export default function PageDetailDescription({ data }) {
  // Use description from the fetched wisata data
  const description = data?.description || "";

  return (
    <main>
      <h4>About the place</h4>
      <p>{description}</p>
      <div className="row" style={{ marginTop: 30 }}>
        {itemDetails.features?.length === 0
          ? "Tidak Ada Feature"
          : itemDetails.features?.map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="col-3"
                style={{ marginBottom: 20 }}
              >
                <img
                  width="38"
                  className="d-block mb-2"
                  src={feature.imageUrl}
                  alt={feature.name}
                />{" "}
                <span>{feature.qty}</span>{" "}
                <span className="text-gray-500 font-weight-light">
                  {feature.name}
                </span>
              </div>
            ))}
      </div>
    </main>
  );
}