import React, { Component } from "react";

import Header from "parts/Header";
import Footer from "parts/Footer";
import ItemDetails from "json/itemDetails.json";
import CbfForm from "parts/CbfForm";

export default class Cbf extends Component {
  componentDidMount() {
    window.title = "CBF Page";
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="page-details">
        <Header {...this.props} />
        <CbfForm ItemDetails={ItemDetails} />
        <Footer />
      </div>
    );
  }
}
