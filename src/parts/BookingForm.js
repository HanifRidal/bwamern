import React, { Component } from "react";
import propTypes from "prop-types";
import Button from "elements/Button";
import { InputNumber, InputDate } from "elements/Form";

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 1,
      data: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    };
  }

  updateDate = (e) => {
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.state;
    if (prevState.data.date !== data.date) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const countDuration = new Date(endDate - startDate).getDate();
      this.setState({ data: { ...this.state.data, duration: countDuration } });
    }
    if (prevState.data.duration !== data.duration) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(
        startDate.setDate(startDate.getDate() + +data.duration - 1)
      );
      this.setState({
        data: {
          ...this.state,
          data: {
            ...this.state.data,
            date: {
              ...this.state.data.date,
              endDate: endDate,
            },
          },
        },
      });
    }
  }

  render() {
    const { data } = this.state;
    const { itemDetails, startBooking } = this.props;
    return (
      <div className="card bordered" style={{ padding: `60px 80px` }}>
        <h4 className="mb-3">start Booking</h4>
        <h5 className="h2 text-teal mb-4">
          ${itemDetails.price}{" "}
          <span className="text-gray-500 font-weight-light">
            per {itemDetails.unit}
          </span>
        </h5>

        <label htmlFor="startDate">Start Date</label>
        <InputDate
          max={30}
          suffix=" night"
          isSuffixPlural
          onChange={this.updateDate}
          name="duration"
          value={data.duration}
        />
      </div>
    );
  }
}

BookingForm.propTypes = {
  itemDetails: propTypes.object,
  startBooking: propTypes.func,
};
