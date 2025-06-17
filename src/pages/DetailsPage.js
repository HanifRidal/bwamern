import React, { Component } from "react";

import Header from "parts/Header";
import PageDetailTitle from "parts/PageDetailTitle";
import FeaturedImage from "parts/FeaturedImage";
import PageDetailDescription from "parts/PageDetailDescription";
import ItemDetails from "json/itemDetails.json"; // Assuming you have a JSON file with item details
import Categories from "parts/Categories";
import Testimony from "parts/Testimony";
import Footer from "parts/Footer";
// import BookingForm from "parts/BookingForm";

export default class DetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wisataData: null,
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    window.title = "Wisata Details";
    window.scrollTo(0, 0);
    this.fetchWisataData();
  }

  fetchWisataData = async () => {
    try {
      const id = this.props.match?.params?.id;
      if (!id) {
        throw new Error("No ID found in URL");
      }

      console.log("Fetching data for ID:", id);

      // Try with the API prefix
      const response = await fetch(`http://localhost:3001/Api/wisata/${id}`);

      if (!response.ok) {
        console.error("Fetch failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      // Check if data is wrapped in a data property
      const wisataData = data.data || data;

      this.setState({
        wisataData: wisataData,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching wisata data:", error);
      this.setState({
        error: error.message,
        isLoading: false,
      });
    }
  };

  render() {
    const { wisataData, isLoading, error } = this.state;
    const breadcrumb = [
      { pageTitle: "Home", pageHref: "/" },
      { pageTitle: "Wisata Details", pageHref: "" },
    ];

    if (isLoading)
      return (
        <div className="container mt-5">
          <div className="text-center">Loading...</div>
        </div>
      );

    if (error)
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            {error}
            <br />
            <small>
              Please check your API endpoint and make sure the server is
              running.
            </small>
          </div>
        </div>
      );

    if (!wisataData)
      return (
        <div className="container mt-5">
          <div className="alert alert-warning">No data found</div>
        </div>
      );

    console.log("Rendering with data:", wisataData);

    // Convert the wisata data to the format expected by your components
    const formattedData = {
      _id: wisataData.TujuanID,
      name: wisataData.NamaTempat,
      type: wisataData.type,
      // Format the imageUrls as objects with url and _id properties
      imageUrls: [
        { url: wisataData.ImgUrl, _id: "main-image" },
        { url: wisataData.Url_1, _id: "additional-1" },
        { url: wisataData.Url_2, _id: "additional-2" },
      ].filter((item) => item.url), // Filter out any items with null/undefined URLs
      city: wisataData.Kota,
      country: "Indonesia",
      description: wisataData.Keterangan,
      popularity: wisataData.Popularity,
      // Add other fields as needed
      categories: [], // You'll need to format or provide this data
      testimonial: {}, // You'll need to format or provide this data

      features: [
        {
          name: "Type",
          qty: wisataData.type,
          imageUrl: "/images/icon-type.svg", // You'll need to create or use appropriate icons
        },
        {
          name: "Popularity",
          qty: `${wisataData.Popularity}/5`,
          imageUrl: "/images/icon-star.svg", // You'll need to create or use appropriate icons
        },
        // You can add more features if needed
      ],

      categories: [],
      testimonial: {},
    };
    return (
      <div>
        <Header {...this.props} />
        <PageDetailTitle breadcrumb={breadcrumb} data={formattedData} />
        <FeaturedImage data={formattedData.imageUrls} />
        <section className="container">
          <div className="row">
            <div className=" pr-5">
              {/* <div className="col-7 pr-5"> */}
              <PageDetailDescription data={formattedData} />
            </div>
            <div className="col-5">
              {/* <BookingForm ItemDetails={ItemDetails} /> */}
            </div>
          </div>
        </section>
        <Categories data={ItemDetails.categories} />
        <Testimony data={ItemDetails.testimonial} />
        <Footer />
      </div>
    );
  }
}