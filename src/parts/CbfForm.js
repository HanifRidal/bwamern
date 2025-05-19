import React, { Component } from "react";
// import propTypes from "prop-types";
import Button from "elements/Button";
import Breadcrumb from "elements/BreadCrumb";
import InputSelect from "elements/Form/InputSelect";
import axios from "axios";


export default class CbfForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeInput: "",
      types: [],
      typeOptions: [],
      recommendations: [],
      loading: false,
      error: null,
    };
  }

   componentDidMount() {
    axios
      .get("http://localhost:3000/Api/TypeWisata")
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          this.setState({
            typeOptions: res.data.data.map((item) => item.type),
          });
        }
      })
      .catch((err) => {
        // Optionally handle error
        console.error(err);
      });
  }

  handleInputChange = (e) => {
    this.setState({ typeInput: e.target.value });
  };

  handleAddType = () => {
    const { typeInput, types } = this.state;
    if (typeInput.trim() && !types.includes(typeInput.trim())) {
      this.setState({
        types: [...types, typeInput.trim()],
        typeInput: "",
      });
    }
  };

  handleRemoveType = (typeToRemove) => {
    this.setState((prevState) => ({
      types: prevState.types.filter((type) => type !== typeToRemove),
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: null });
    axios
      .post("http://localhost:3000/Api/recommendations", {
        type: this.state.types,
      })
      .then((res) => {
        this.setState({
          recommendations: res.data.data || [],
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          error: err.message,
          loading: false,
        });
      });
  };

  render() {
    const { typeInput, types, typeOptions, recommendations, loading, error } = this.state;
    const breadcrumb = [
      { pageTitle: "Home", pageHref: "/" },
      { pageTitle: "CBF Algorithm", pageHref: "" },
    ];
    return (
      <section className="container spacing-sm">
        {/* <Fade bottom> */}
        <div className="row align-items-center">
          <div className="col">
            <Breadcrumb data={breadcrumb} className="mb-3" />
          </div>

          <div className="col-auto text-center">
            <h1 className="h2">Content-Based Filtering</h1>
            <span className="text-gray-400">
              Input Type Vacation for CBF Algorithm
            </span>
          </div>

          <div className="col"></div>
        </div>
        {/* </Fade> */}

        <form
          className="card bordered text-center"
          style={{ padding: `60px 80px`, height: "50vh" }}
          onSubmit={this.handleSubmit}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <InputSelect
              value={typeInput}
              onChange={this.handleInputChange}
              placeholder="Select type vacation"
              options={typeOptions}
            />
            <Button
              className="btn ml-4"
              hasShadow
              isPrimary
              onClick={this.handleAddType}
              type="button"
            >
              +
            </Button>
          </div>
          <div>
            {types.map((type) => (
              <span key={type} style={{ marginRight: 8 }}>
                {type}
                <Button
                  className="btn ml-2"
                  hasShadow
                  isPrimary
                  onClick={() => this.handleRemoveType(type)}
                  aria-label={`Remove ${type}`}
                  type="button"
                >
                  &times;
                </Button>
              </span>
            ))}
          </div>
          
        </form>

        {/* Show loading/error */}
        {loading && <div>Loading recommendations...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        {/* Show recommendations */}
        {recommendations.length > 0 && (
          <div className="container mt-4">
            <div className="row">
              {recommendations.map((item) => (
                <div
                  className="item column-3 row-1 col-md-4 mb-4"
                  key={`item-${item.type}-item-${item.NamaTempat}`}
                >
                  <div className="card">
                    <div className="mb-3 font-weight-medium" style={{ width: "fit-content" }}>
                      {item.type}
                    </div>
                    {item.similarity >= 1 && (
                      <div className="tag">
                        Best <span className="font-weight-light">Choice</span>
                      </div>
                    )}
                    {item.similarity < 1 && (
                      <div className="tag" style={{ backgroundColor: "#ffe4c4"}}>
                        Good <span className="font-weight-light">Choice</span>
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
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }
}

CbfForm.propTypes = {};
