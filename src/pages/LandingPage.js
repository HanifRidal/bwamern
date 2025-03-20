import React, { Component } from 'react'

import moduleName from 'parts/Header';
import Header from 'parts/Header';

export default class landingpage extends Component {
  render() {
    return (
      <>
        <Header {...this.props}></Header>
      </>
    )
  }
}
