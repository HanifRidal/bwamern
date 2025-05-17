import React from "react";

export default function PageDetailDescription({ data }) {
  // Ambil fitur dari data.features
  const features = Array.isArray(data?.features) ? data.features : [];
  const description = data?.description || "";

  return (
    <main>
      <h4>About the place</h4>
      <p>{description}</p>
      <div className="row" style={{ marginTop: 30 }}>
        {features.length === 0
          ? "Tidak Ada Feature"
          : features.map((feature, index) => (
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
