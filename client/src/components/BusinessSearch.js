import React, { Component } from 'react'
import Logo from './reusable/LokalsLogo';
import TextFieldGroup from './reusable/TextFieldGroup';
import './BusinessSearch.css';
import Axios from 'axios';
import { connect } from 'react-redux';
import { goToEditBusinessProfile } from '../actions/businessAction';
import LokalsMapbox from './LokalsMapbox/LokalsMapbox';
import { capitalize } from '../util/stringFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    this.timer = null;
  }
  getPhotoUrl(photoref, key) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoref}&key=${key}`
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  scrollDown(offsetY) {
    window.scrollTo(0 ,offsetY);
    clearInterval(this.timer);
  }
  handleResult(data) {
    var resultSection = document.getElementById('result_section');
    this.timer = setInterval(() => {
      this.scrollDown(resultSection.offsetTop - 60);
    }, 200);
    this.setState({result: data, errors: {}})
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
        return this.handleResult(res.data);
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
      <div className="business-search" style={{backgroundImage: `url(${"/images/img-27.jpg"})`}}>
        <div className="bkdrp"></div>
        <div className="business-search-form">
          <h2 className="header-1"><Logo styles={{fontSize: `calc(1em + 2px)`}}/> for Business</h2>
          <h5 className="header-sub-1">Reach out to your customers <br/>using a smart advertising platform.</h5>
          <h5 className="header-sub-2">Claim your business today.</h5>
            <form onSubmit={(e) => this.onSubmit(e)}>
              <div className="form-group-inline pt-2 pb-2">
              <TextFieldGroup
                divclass="mr-3 w-50"
                type="text"
                label="Business Name*"
                labelclassname="ft-label"
                classname="form-control form-control-md ft-d inp-flat bd-tr-50 bd-br-50"
                placeholder="Business name" 
                name="business_name"
                error={errors && errors.business_name}
                onChange={(e) => this.onChange(e)}
              />
              <TextFieldGroup
                divclass="mr-3 w-50"
                type="text"
                label="Street Address*"
                labelclassname="ft-label"
                classname="form-control form-control-md ft-d inp-flat"
                value={this.state.business_address}
                placeholder="Street addresss" 
                name="business_address"
                error={errors && errors.business_address}
                onChange={(e) => this.onChange(e)}
              />
              <TextFieldGroup
                type="text"
                label="Zipcode"
                labelclassname="ft-label"
                classname="form-control form-control-md ft-d inp-flat"
                value={this.state.business_zipcode}
                placeholder="Zipcode" 
                name="business_zipcode"
                onChange={(e) => this.onChange(e)}
              />
              </div>
              <input
                type="submit"
                className="form-control form-control-md ft-d inp-btn flat"
                name="search"
                value="Get Started"
              />
          </form>
        </div>
        <div className="result-section" id="result_section">
        { 
          Object.keys(result).length !== 0 && 
          <div className="business-search-results" id="section-result">
            {/* <h3 className="result-section-title">Result for '<strong>{this.state.business_name}</strong>'</h3> */}
            <div className="result-container">
              <div className="result-object" id={result.place_id}>
                  {/* <div className="result-img" style={result.photos[0].photo_reference && {backgroundImage:`url(${'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+result.photos[0].photo_reference+'&key='+GOOGLE_MAP_API})`}}></div> */}
                <div className="result-detail">
                  <h5 className="result-section-title">We found you!</h5>
                  <h2 className="result-name">{result.name}</h2>
                  <h5 className="result-price-type">
                    <span className="info-icon"><FontAwesomeIcon icon="utensils"/></span>
                    <span className="result-type">
                    {capitalize(result.types[0].split('_').join(' '))}</span> 
                    <span className="result-price">{Array.apply(null, Array(result.price_level)).map((item,i)=><span key={i}>$</span>)}</span>
                  </h5>
                  <h5 className="result-address">
                    <span className="info-icon"><FontAwesomeIcon icon="map-marker-alt"/></span>{result.formatted_address}</h5>
                </div>
                <div className="claim-form">
                  <p className="common-text">Awesome! Now, claim you business to get access to our powerful advertising tools for business.</p>
                  <div className="claim-btns">
                    <button 
                      className="btn btn-primary"
                      onClick={(e) => this.onCliam(e, result.place_id)}
                    >
                      Claim my business
                    </button>
                    <button 
                      className="btn-link"
                      >
                      Not your business?
                    </button>
                  </div>
                </div>
              </div>
              <LokalsMapbox
                markers={new Array(result)}
                showMarkerNumber={false}
                staticMap={true}
                showPopup={false}
                viewport={{
                  width: '100%',
                  height: '100%',
                  zoom: 15,
                  latitude: result.geometry.location.lat,
                  longitude: result.geometry.location.lng,
                  bearing: 0,
                  pitch: 0,
                }}
                containerClass={'result-map'}
              />
            </div>
          </div>
        }
        </div>
      </div>
    )
  }
}

export default connect(null, { goToEditBusinessProfile })(BusinessSearch);