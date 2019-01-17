import React, { Component } from 'react'
import { connect } from 'react-redux'
import isEmpty from '../util/is-empty'
import InputFieldGroup from './reusable/InputFieldGroup';
import './ClaimBusiness.css'
import Axios from 'axios';
import Navbar from './Navbar';
var UsaStates = require('usa-states').UsaStates;

const usStates = new UsaStates();
const stateAbbreviations = usStates.arrayOf('abbreviations');
// const stateNames = usStates.arrayOf('names');

const FORM_INITIAL_STATE = {
  businessName: '',
  businessType: '',
  formatted_address: '',
  addressFields: {
    street: '',
    city: '',
    state: '',
    country: '',
    zipcode: ''
  },
  ggPlaceId: '',
  openhours: null,
  categories: [],
}
class ClaimBusiness extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...FORM_INITIAL_STATE,
      errors: {}
    };
  }
  componentDidMount() {
    if (Object.keys(this.props.business.profile).length !== 0) {
      const { profile } = this.props.business;
      const addressFields = this.splitAddress(profile.formatted_address);
      const businessData = {
        businessName: profile.name,
        businessType: profile.business_type,
        formatted_address: profile.formatted_address,
        addressFields: addressFields,
        ggPlaceId: profile.google_place_id,
        openingHours: profile.opening_hours,
        categories: profile.categories,
      }
      return this.setState(businessData);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.business.profile !== this.props.business.profile) {
      const { profile } = this.props.business;
      const addressFields = this.splitAddress(profile.formatted_address);
      const businessData = {
        businessName: profile.name,
        businessType: profile.business_type,
        formatted_address: profile.formatted_address,
        addressFields: addressFields,
        ggPlaceId: profile.google_place_id,
        openingHours: profile.opening_hours,
        categories: profile.categories,
      }
      console.log(businessData);
      return this.setState(businessData);
    }
  }
  onChange(e, parent) {
    e.preventDefault();
    if (parent) {
      return this.setState({ [parent]: { ...this.state.addressFields, [e.target.name]: e.target.value }})
    }
    return this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    var newFormattedAddress = [];
    for (var key in this.state.addressFields) {
      console.log(key, this.state.addressFields[key]);
      newFormattedAddress.push(this.state.addressFields[key]);
    }
    var finalBusinessData = {
      business_name: this.state.businessName,
      business_type: this.state.businessType,
      formatted_address: newFormattedAddress.join(', '),
      street: this.state.addressFields.street,
      city: this.state.addressFields.city,
      state: this.state.addressFields.state,
      country: this.state.addressFields.country,
      zipcode: this.state.addressFields.zipcode,
      google_place_id: this.state.ggPlaceId,
      categories: this.state.categories.join(','),
      opening_hours: this.state.openingHours.map(day => `${day.open.day}:${day.open.time}:${day.close.time}`).join(',')
    }
    console.log(finalBusinessData);
    Axios.post('/api/business/profile', finalBusinessData)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  }
  splitAddress(address) {
    var addressFields = address.split(',').map(field => field.trim());
    const stateAndZip = addressFields.reverse()[1].split(' ');
    const keys = ['street','city','state','country','zipcode'];
    addressFields.splice(1, 1, stateAndZip[0]);
    addressFields.splice(0, 0, stateAndZip[1]);
    addressFields.reverse();
    const addressObj = keys.reduce((obj, key, i) => Object.assign(obj, {[key]:addressFields[i]}), {})
    return addressObj;
  }
  render() {
    // const { profile } = this.props.business;
    const { 
      businessName,
      businessType,
      formatted_address,
      addressFields,
      ggPlaceId,
      openingHours,
      categories,
      errors 
    } = this.state;
    const { info } = "";
    const isDisable = () => {
      return isEmpty(businessName) || isEmpty(businessType) || isEmpty(formatted_address) || isEmpty(addressFields.street) || isEmpty(addressFields.city) || isEmpty(addressFields.state) || isEmpty(addressFields.country) || isEmpty(addressFields.zipcode) || isEmpty(ggPlaceId) || isEmpty(openingHours) || isEmpty(categories);
    };
    return (
      <div className="claim-business-page">
        <Navbar/>
        <div className="form-fields">
          <h1 className="page-title">Please provide your business details</h1>
          <p className="page-text common">We need your infomation to create an account.</p>
          <div className="input-form business">
            <form onSubmit={(e) => this.onSubmit(e)}>
              <div className="inline-input-control w-100">
                <InputFieldGroup 
                  name="businessName"
                  label="Business Name"
                  classname="input-field w-100"
                  placeholder="Business Name"
                  value={businessName}
                  error={errors.business_name}
                  type="text"
                  onChange={(e) => this.onChange(e)}
                  info="Business name you want to show on Lokals"
                />
              </div>
              <div className="inline-input-control w-100">
                <InputFieldGroup 
                  name="businessType"
                  label="Business Type"
                  classname="input-field"
                  placeholder="Business Type"
                  value={businessType}
                  error={errors.business_type}
                  type="text"
                  onChange={(e) => this.onChange(e)}
                />
              </div>
              <div className="inline-input-control flex w-100">
                <InputFieldGroup 
                  name="street"
                  label="Street"
                  divclassname="w-60"
                  classname="input-field w-100"
                  placeholder="Street"
                  value={addressFields.street}
                  error={errors.street}
                  type="text"
                  onChange={(e) => this.onChange(e, 'addressFields')}
                />
                <InputFieldGroup 
                  name="city"
                  label="City"
                  classname="input-field"
                  placeholder="City"
                  value={addressFields.city}
                  error={errors.city}
                  type="text"
                  onChange={(e) => this.onChange(e, 'addressFields')}
                />
              </div>
              <div className="inline-input-control flex w-100">
                <div className="input-control">
                  <label className="input-label">State</label>
                  <div className="input-options">
                    <select 
                      name="state"
                      value={addressFields.state || "CA"} 
                      onChange={(e) => this.onChange(e, 'addressFields')}
                    >
                      {stateAbbreviations && stateAbbreviations.map((abbr, i) => (
                        <option value={abbr} key={i}>{abbr}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <InputFieldGroup 
                  name="country"
                  label="Country"
                  classname="input-field"
                  placeholder="Country"
                  value={addressFields.country}
                  error={errors.country}
                  type="text"
                  onChange={(e) => this.onChange(e, 'addressFields')}
                />
                <InputFieldGroup 
                  name="zipcode"
                  label="Zipcode"
                  classname="input-field"
                  placeholder="Zipcode"
                  value={addressFields.zipcode}
                  error={errors.zipcode}
                  type="text"
                  onChange={(e) => this.onChange(e, 'addressFields')}
                />
              </div>
              {/* <button onClick={(e) => this.splitAddress(e, profile.formatted_address)}>Split</button>
              <button onClick={(e) => {e.preventDefault()
              return console.log(addressFields)}}>Address</button> */}
              <div className="submit-btn-control">
                <input 
                  type="submit" 
                  className="input-submit"
                  value="Submit"
                  disabled={isDisable()}
                />
                { info && <small className="form-text text-muted">{info}</small>}
                { errors.submit && <small>{ errors.submit }</small>}
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  business: state.business
});

export default connect( mapStateToProps, {} )(ClaimBusiness);
