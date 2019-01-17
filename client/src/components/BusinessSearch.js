import React, { Component } from 'react'
import Logo from './reusable/LokalsLogo';
import TextFieldGroup from './reusable/TextFieldGroup';
import './BusinessSearch.css';
import { GOOGLE_MAP_API } from '../config/keys';
import Axios from 'axios';
import { connect } from 'react-redux';
import { goToEditBusinessProfile } from '../actions/businessAction';
import Navbar from './Navbar';

class BusinessSearch extends Component {
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
  getPhotoUrl(photoref, key) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoref}&key=${key}`
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
    Axios
      .post(`/api/business/findbusiness`, request)
      .then(res => {
        // var pageBottom = document.getElementById('section-result').;
        // console.log(window.innerWidth);
        // window.scrollTo(0 ,window.screenY);
        return this.setState({result: res.data, errors: {}})
      })
      .catch(err => {
        return this.setState({ errors: err.response.data });
      });
  }
  onCliam(e, placeid) {
    e.preventDefault();
    Axios
      .get(`/api/business/findbusiness/google-place-id/${placeid}`)
      .then(res => {
        this.props.goToEditBusinessProfile(res.data, this.props.history);
        return
      })
      .catch(err => console.log(err))
  }
  render() {
    var { errors, result } = this.state;
    return (
      <div className="business-search">
        <Navbar/>
        <div className="business-search-form">
        <h2 className="header-1"><Logo /> for Business</h2>
        <h5 className="header-sub-1">Reach out to your customers <br/>using a smart advertising platform.</h5>
        <h5 className="header-sub-2">Claim your business today.</h5>
          <form onSubmit={(e) => this.onSubmit(e)}>
            <div className="form-group-inline pt-2 pb-2">
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
        </div>
        { 
          Object.keys(result).length !== 0 && 
          <div className="business-search-results" id="section-result">
            <h3 className="result-section-title">Result for '{this.state.business_name}'</h3>
            <div className="result-object" id={result.place_id}>
              <div className="result-img">
                {result.photos[0].photo_reference && 
                <img 
                  style={result.photos[0].height > result.photos[0].width ? { width: `100%`}:{ height: `100%`}}
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=${GOOGLE_MAP_API}`} alt={"Good Job"}/>}
              </div>
              <div className="result-detail">
                <h2 className="result-name">{result.name}</h2>
                <h5 className="result-address">{result.formatted_address}</h5>
                <div className="claim-btns">
                  <button 
                    className="btn btn-success"
                    onClick={(e) => this.onCliam(e, result.place_id)}
                  >
                    Yes!
                  </button>
                  <button 
                    className="btn btn-light"
                    >
                    Nope
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default connect(null, { goToEditBusinessProfile })(BusinessSearch);