import React, { Component } from "react";
// import propTypes from "prop-types";
import Button from "elements/Button";
import Breadcrumb from "elements/BreadCrumb";
import InputSelect from "elements/Form/InputSelect";

const TYPE_OPTIONS = [
  "Historical",
  "Beach",
  "Mountain",
  "City",
  "Village",
  "Adventure",
];

export default class CbfForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeInput: "",
      types: [],
    };
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
    alert(JSON.stringify({ type: this.state.types }));
  };

  render() {
    const { typeInput, types } = this.state;
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
              options={TYPE_OPTIONS}
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
          <Button
            className="btn px-5"
            hasShadow
            isPrimary
            // type="submit"
            style={{ marginTop: "16px", justifyContent: "center" }}
          >
            Submit the Reference
          </Button>
        </form>
      </section>
    );
  }
}

CbfForm.propTypes = {};
