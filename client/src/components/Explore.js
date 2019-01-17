import React, { Component } from 'react'
// import Axios from 'axios';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faLocationArrow, faInfoCircle, faMapMarkerAlt , faClock,faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart, faMap } from '@fortawesome/free-solid-svg-icons'

import { GOOGLE_MAP_API } from '../config/keys';

import image from '../images/event-img-01.jpg';
import image2 from '../images/event-img-02.jpg';

import Map from './Map';
import SearchBar from './SearchBar';

import { setSearchResults, setMapCenter, setZoom } from '../actions/searchActions';
import { setProfile, saveToCollections } from '../actions/profileActions';

import ResultCard from './ResultCard';

import './Explore.css';

library.add(faLocationArrow, faInfoCircle, faMapMarkerAlt, faClock, faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart, faMap, fab);

const INITIAL_STATE = {
  keywords: 'restaurant',
  userprofile: {},
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
      zoom: 13,
      center: null,
      selected: '',
      showResult: true,
      isStyled: true
    }
  }
  componentDidMount() {
    if (this.props.search.businessResults.length  > 0) {
      this.setState({ center: this.props.search.businessResults[0].location });
      this.onShow();
    }
    if (this.props.auth.isAuth) {
      this.props.setProfile();
    }
    this.onShow();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.search.businessResults !== this.props.search.businessResults) {
      this.onShow();
      this.setState({ center: this.props.search.businessResults[0].location, selected: this.props.search.businessResults[0]._id });
      return true;
    }
    return false;
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onShow() {
    this.setState({showResult: true});
  }
  onSubmit(e) {
    if (e) e.preventDefault();
    const { keywords } = this.state;
    const { results } = this.props.search.businessResults;
    this.props.setSearchResults(keywords, 12);
    this.setState({ markers: results, zoom: 12, center: results[0].location, selected: results[0]._id });
    this.onShow();
  }
  centerMap(e,location, id) {
    if (e) e.preventDefault();
    this.setState({ center: location, selected: id, zoom: 12 });
  }
  onSave(e, businessId) {
    if (e) e.preventDefault();
    const { isAuth } = this.props.auth;
    if (isAuth) {
      this.props.saveToCollections(businessId);
    } else {
      window.alert("Ya need to log in to do dat, bro");
    }
  }
  onToggleTheme(e) {
    if (e) e.preventDefault();
    this.setState({ isStyled: !this.state.isStyled });
  }
  render() {
    const { collections } = this.props.user.profile;
    return (
      <div className="explore-page" id="explore-page">
        <div className={this.state.isStyled ? "map-theme-toggle" : "map-theme-toggle dark"} onClick={(e) => this.onToggleTheme(e) }>
          <FontAwesomeIcon icon="map" className="theme-icon"/><span>{this.state.isStyled ?"Light":"Dark"}</span>
        </div>
        <SearchBar
          classname="searching-bar left"
        />
        <div className="map-container" >
          <Map
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ display:'block', height: `480px`, width: `40vw`, margin: '0 0', borderRadius: `0`, boxShadow: `0 0 6px 0 rgba(0,0,0,0.1)`, overflow: `hidden` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            markers={this.props.search.businessResults}
            center={this.state.center}
            isOpen={this.state.selected}
            zoom={this.props.search.zoom}
            onclickmarker={(e,location,id) => this.centerMap(e, location, id)}
            isStyled={this.state.isStyled}
          />
          <div className="search-display right">
            <h2 className="happening-title">What is going on near <span className="current-location">San Francisco</span><FontAwesomeIcon icon="location-arrow"></FontAwesomeIcon></h2>
            {this.props.search.businessResults && this.props.search.businessResults.map(marker => (
              <ResultCard
                key={marker._id}
                classname="search-result"
                result={marker}
                selected={this.state.selected}
                centermap={(e, location, id) => this.centerMap(e, location, id)}
                collections={collections}
                onsave={(e, id) => this.onSave(e, id)}
              />
            ))}
          </div>
        </div>
      {/* <div className="search-display" id="display-result">
        {this.props.search.businessResults && this.props.search.businessResults.map(marker => (
          <ResultCard
            key={marker._id}
            result={marker}
            selected={this.state.selected}
            centermap={(e, location, id) => this.centerMap(e, location, id)}
            collections={collections}
            onsave={(e, id) => this.onSave(e, id)}
          />
        ))}
      </div> */}
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
      </div>
    )
  }
}

Explore.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  search: state.search
});

export default connect(mapStateToProps, { setSearchResults, setMapCenter, setZoom, setProfile, saveToCollections })(Explore);
