import React, { Component } from 'react'
import axios from 'axios';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faLocationArrow, faInfoCircle, faMapMarkerAlt ,faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons'
// import TextFieldGroup from './reusable/TextFieldGroup';
import './Explore.css';
import image from '../images/event-img-01.jpg';
import image2 from '../images/event-img-02.jpg';
import Map from './Map';
import SearchBar from './SearchBar';
import { setSearchResults, setMapCenter } from '../actions/searchActions';
import { GOOGLE_MAP_API } from '../config/keys';

library.add(faLocationArrow, faInfoCircle, faMapMarkerAlt, faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart, fab);

const INITIAL_STATE = {
  keywords: '',
  result: [],
  events: [],
  story: [],
  list: []
}
class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      markers: [],
      zoom: 12,
      center: null,
      showResult: false
    }
  }
  componentDidMount() {
    if (this.props.search.businessResults.length  > 0) {
      this.setState({ center: this.props.search.businessResults[0].location });
      this.onShow();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.search.businessResults !== this.props.search.businessResults) {
      this.onShow();
      this.setState({ center: this.props.search.businessResults[0].location });
      return true;
    }
    return false;
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onShow() {
    document.getElementById('display-result').style.height = 'calc(120px + 10px)';
    this.setState({showResult: true});
  }
  onSubmit(e) {
    e.preventDefault();
    const keywords = this.state.keywords;
    axios
      .get(`/api/business/search/category/${keywords}`)
      .then(res => {
        this.setState({ markers: res.data, zoom: 15, center: res.data[0].location });
        this.onShow();
        return console.log(res.data);
      })
      .catch(err => console.log(err));
  }
  centerMap(e,location) {
    e.preventDefault();
    console.log(location);
    this.props.setMapCenter(location);
    this.setState({ center: location });
  }
  onSave(e, businessId) {
    e.preventDefault();
    const { isAuth } = this.props.auth;
    if (isAuth) {
      // axios
      // .post(`/api/business/id/${businessId}/save` )
      // .then(res => {
      //   if (res.data.success) {
      //     return console.log("Success")
      //   } else {
      //     return console.log(res.data);
      //   }
      // })
      // .catch(err => console.log(err));
      axios
        .post(`/api/profile/collections`, { business_id: businessId })
        .then(res => {
          if (res.data.success) {
            return console.log("Success")
          } else {
            return console.log(res.data);
          }
        })
        .catch(err => console.log(err));
    }
  }
  render() {
    return (
      <div className="explore-page">
          <SearchBar/>
          <Map
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ display:'block', height: `400px`, width: `100vw`, margin: '0 auto 20px auto', borderRadius: `0`, boxShadow: `0 0 6px 0 rgba(0,0,0,0.1)`, overflow: `hidden` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            markers={this.props.search.businessResults}
            center={this.state.center}
            isOpen={true}
            icon={(<FontAwesomeIcon icon="grin-stars"></FontAwesomeIcon>)}
            zoom={this.props.search.zoom}
            panto={this.state.center}
          />
        <div className="search-display" id="display-result">
          {this.props.search.businessResults && this.props.search.businessResults.map(marker => (
            <div className="search-result" key={marker._id} onClick={(e) => this.centerMap(e, marker.location)}>
              <div className="business-detail">
                <div className="head">
                  <h4 className="business-name">{marker.business_name}</h4>
                  <p className="business-type">{marker.business_type}</p>
                </div>
                <p className="formatted-address">
                  <FontAwesomeIcon icon="map-marker-alt" className="address-icon"/>{marker.address && marker.address.formatted_address}
                  {marker.formatted_address && marker.formatted_address}
                </p>
              </div>
              <div className="buttons">
                <FontAwesomeIcon icon="heart" className="like-icon"/>
                <FontAwesomeIcon icon="bookmark" className="save-icon" onClick={(e) => this.onSave(e, marker._id)}/>
              </div>
            </div>
          ))}
        </div>
        <h3 className="more-text">More to explore in <span style={{color: `rgb(52, 230, 96)`}}>San Francisco</span></h3>
        <div className="happening-container">
          <div className="bound main">
            <h3 className="content-title">New Events and Activities</h3>
            <div className="frame">
              <img className="object-image" src={image} alt="event" />
              <div className="info-head">
                <h6 className="object-date"><span className="time">19:00</span> | <span className="date">Jan 23rd</span></h6>
                <h4 className="object-title">Pétillant-Natural Testing Flight</h4>
              </div>
              <div className="info-detail">
                <p className="location">
                  <FontAwesomeIcon icon="map-marker-alt" className="detail-icon"/>
                  West Coast Wine & Cheese
                </p>
                <div className="brief-desc">
                  <FontAwesomeIcon icon="info-circle" className="detail-icon"/>
                  <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bound sub-1">
            <h3 className="content-title">Stories</h3>
            <div className="frame">
              <p className="post-at">23m</p>
              <img className="object-image" src={image2} alt="event" />
              <div className="info-head">
                <h4 className="object-title story">20% off a bottle before 7:00pm</h4>
              </div>
              <div className="info-detail">
                <p className="location">
                  <FontAwesomeIcon icon="map-marker-alt" className="detail-icon"/>
                  West Coast Wine & Cheese
                </p>
                <div className="brief-desc">
                  <FontAwesomeIcon icon="info-circle" className="detail-icon"/>
                  <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="search-form">
          
        </div>
        <div className="results-group">
          {/* {cards} */}
        </div>
          {/* {this.state.results.suggestion && (<div className="no-result">
          {this.state.results.suggestion.map((keyword, index) => (<p className="btn-d" key={index}>{keyword}</p>))}
          </div>)}
          {this.state.results.businessmatched && (<div className="no-result">
          {this.state.results.businessmatched}
          </div>)} */}
      </div>
    )
  }
}

Explore.propTypes = {
  auth: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  search: state.search
});

export default connect(mapStateToProps, { setSearchResults, setMapCenter })(Explore);
