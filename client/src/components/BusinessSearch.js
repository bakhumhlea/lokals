import React, { Component } from 'react'
import axios from 'axios';
import Logo from './reusable/LokalsLogo';
import TextFieldGroup from './reusable/TextFieldGroup';
import './BusinessSearch.css';

export default class BusinessSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      business_name: '',
      business_address: 'San Francisco, CA',
      business_zipcode: '94123',
      result: {},
      errors: {}
    }
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault();
    var { business_name, business_address, business_zipcode } = this.state;
    const request = {
      business_name: business_name,
      business_address: business_address,
      business_zipcode: business_zipcode,
    };
    axios
      .post(`/api/business/findbusiness`, request)
      .then(res => {
        console.log(res.data);
        return this.setState({result: res.data, errors: {}})
      })
      .catch(err => {
        console.log(err.response.data);
        return this.setState({ errors: err.response.data });
      });
  }
  render() {
    var { errors } = this.state;
    return (
      <div className="business-search">
        <h2 className="header-1"><Logo /> for Business</h2>
        <h5 className="header-sub-1">Reach out to your customers <br/>using a smart advertising platform.</h5>
        <h5 className="header-sub-2">Claim your business today.</h5>
          <form onSubmit={(e) => this.onSubmit(e)}>
            <div className="form-group-inline">
            <TextFieldGroup
              divclass="mr-3 w-50"
              type="text"
              label="Business Name*"
              labelclassname="ft-d pb-1"
              classname="form-control form-control-md ft-d inp-d bd-tr-50 bd-br-50"
              placeholder="Business name" 
              name="business_name"
              error={errors.business_name}
              onChange={(e) => this.onChange(e)}
            />
            <TextFieldGroup
              divclass="mr-3 w-50"
              type="text"
              label="Street Address*"
              labelclassname="ft-d pb-1"
              classname="form-control form-control-md ft-d inp-d"
              value={this.state.business_address}
              placeholder="Street addresss" 
              name="business_address"
              error={errors.business_address}
              onChange={(e) => this.onChange(e)}
            />
            <TextFieldGroup
              type="text"
              label="Zipcode"
              labelclassname="ft-d pb-1"
              classname="form-control form-control-md ft-d inp-d"
              value={this.state.business_zipcode}
              placeholder="Zipcode" 
              name="business_zipcode"
              onChange={(e) => this.onChange(e)}
            />
            </div>
            <input
              type="submit"
              className="form-control form-control-md ft-d inp-btn"
              name="search"
              value="Get Started"
            />
          </form>
          { Object.keys(this.state.result).length !== 0 && <div className="ft-d">Found: {this.state.result.name}</div>}
      </div>
    )
  }
}
