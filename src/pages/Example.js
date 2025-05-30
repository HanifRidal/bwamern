import React, { Component } from "react";
import { InputDate } from "elements/Form";
// import BreadCrumb from "elements/BreadCrumb";

export default class Example extends Component {
  state = {
    value: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    console.log(this.state);
    return (
      <div className="container">
        <div
          className="row align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className="col-auto">
            <InputDate
              max={30}
              onChange={this.handleChange}
              name="value"
              value={this.state.value}
            />
            {/* <BreadCrumb></BreadCrumb> */}
          </div>
        </div>
      </div>
    );
  }
}
