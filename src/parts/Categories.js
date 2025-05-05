import Button from "elements/Button";
import React from "react";

export default function Categories({ data }) {
  return data.map((category, index1) => {
    return (
      <section key={`category${category}`} className="container">
        <h4 className="mb-3 font-weight-medium">{category.name}</h4>
        <div className="container-grid">
          {category.items.lenght === 0 ? (
            <div className="row">
              <div className="col-auto align-items-center">
                There is noo property at this category
              </div>
            </div>
          ) : (
            category.items.map((item, index2) => {
              return (
                <div
                  className="item column-3 row-1"
                  key={`item-${index1}-item-${index2}`}
                >
                  <div className="card">
                    {item.isPopular && (
                      <div className="tag">
                        Popular{" "}
                        <span className="font-weight-light">Choise</span>
                      </div>
                    )}
                    <figure className="img-wrapper" style={{ height: 180 }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="img-cover"
                      />
                    </figure>
                    <div className="meta-wrapper">
                      <Button
                        type="link"
                        className="streched-link d-block text-gray-800"
                        href={`/properties/${item._id}`}
                      >
                        <h5 className="h4">{item.name}</h5>
                      </Button>
                      <span className="text-gray-500">
                        {item.city}, {item.country}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    );
  });
}
