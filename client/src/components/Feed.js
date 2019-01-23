import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faLocationArrow, faInfoCircle, faMapMarkerAlt , faClock,faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart, faMap } from '@fortawesome/free-solid-svg-icons'

import { GOOGLE_MAP_API } from '../config/keys';

import { setSearchResults, setMapCenter, setZoom } from '../actions/searchActions';
import { setProfile, saveToCollections } from '../actions/profileActions';

import Map from './Map';
import ResultCard from './ResultCard';

import './Feed.css';
import AdsCard from './AdsCard';
import Navbar from './Navbar';
library.add(faLocationArrow, faInfoCircle, faMapMarkerAlt, faClock, faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart, faMap, fab);

const adsImg = [];
const imagesNum = 9;
const composition = [
  { orient: 'square', fit: 'fit-width', text: 'center'},
  { orient: 'horiz', fit: 'fit-height', text: 'left'},
  { orient: 'horiz', fit: 'fit-height', text: 'left'},
  { orient: 'square', fit: 'fit-height', text: 'center'},
  { orient: 'horiz', fit: 'fit-height', text: 'center'},
  { orient: 'square', fit: 'fit-height', text: 'center'},
  { orient: 'verti', fit: 'fit-height', text: 'left'},
  { orient: 'square', fit: 'fit-height', text: 'center'},
  { orient: 'horiz', fit: 'fit-height', text: 'left'},
];
var n = 0;
while (n < imagesNum) {
  var imageObj = {
    url: `/images/img-0${n+1}.jpg`,
    orientation: composition[n].orient,
    imagefit: composition[n].fit,
    textalign: composition[n].text
  }
  adsImg.push(imageObj);
  n++;
}
const INITIAL_STATE = {
  location: 'San Francisco',
  keywords: 'Wine',
  opennow: false,
  mostlove: false,
  currentResults: {},
  userprofile: {},
  result: [],
  events: [],
  story: [],
  list: []
}

class Feed extends Component {
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
    this.props.setSearchResults(this.state.keywords, 13);
    if (this.props.search.businessResults.length  > 0) {
      this.setState({ center: this.props.search.businessResults[0].location, selected: this.props.search.businessResults[0]._id });
      this.onShow();
    }
    if (this.props.auth.isAuth) {
      this.props.setProfile();
    }
    this.setState({
      currentResults: {
        keyword: this.state.keywords,
        location: this.state.location
      }
    })
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
  onFilter(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: !this.state[e.target.name]});
  }
  onToggleTheme(e) {
    if (e) e.preventDefault();
    this.setState({ isStyled: !this.state.isStyled });
  }
  onShow() {
    this.setState({showResult: true});
  }
  onSubmit(e) {
    e.preventDefault();
    const keywords = this.state.keywords;
    this.setState({
      currentResults: {
        keyword: keywords,
        location: this.state.location
      }
    })
    this.props.setSearchResults(keywords, 13);
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
  centerMap(e,location, id) {
    if (e) e.preventDefault();
    this.setState({ center: location, selected: id, zoom: 12 });
  }
  render() {
    const { collections } = this.props.user.profile;
    return (
      <div className="feed-page">
      <Navbar/>
        <div className="top-bar">
          <form onSubmit={(e) => this.onSubmit(e)}>
          <div className="search-bar">
            <div className="search-form">
              <FontAwesomeIcon icon="search" className="search-icon"
              onClick={(e) => this.onSubmit(e)}></FontAwesomeIcon>
              {/* <span>Looking for</span> */}
                <input
                  type="text"
                  className="input-search"
                  placeholder="Search Anything" 
                  name="keywords"
                  value={this.state.keywords}
                  onChange={(e) => this.onChange(e)}
                />
              <FontAwesomeIcon icon="times" className="clear-results-icon" 
                style={this.state.keywords.length>0?{display: 'block'}:{display: 'none'}}
                onClick={(e) => this.setState({keywords: ''})}
              />
            </div>
            <div className="location-form">
              <FontAwesomeIcon icon="map-marker-alt" className="location-icon"></FontAwesomeIcon>
              <span className="input-location-text">
                in 
              </span>
              <input
                type="text"
                className="input-location"
                placeholder="San Francisco" 
                name="location"
                value={this.state.location}
                onChange={(e) => this.onChange(e)}
              />
            </div>
            <div className="filter-form">
              <button type="button" className={this.state.opennow?"open-now selected":"open-now"} onClick={(e) => this.onFilter(e)} name="opennow">
                <FontAwesomeIcon icon="clock" className="filter-icon"></FontAwesomeIcon>
                Open Now
              </button>
              <button type="button" className={this.state.mostlove?"most-love selected":"most-love"} onClick={(e) => this.onFilter(e)} name="mostlove">
                <FontAwesomeIcon icon="heart" className="filter-icon"></FontAwesomeIcon>
                Most Love
              </button>
            </div>
            <input
              type="submit"
              className="submit-search"
              value="Search"
            />
          </div>
          </form>
        </div>
        <div className="page-results">
          <h4 className="results-title">
            <strong>Results</strong> for 
            <span className="results-keywords">{this.state.currentResults.keyword}</span>
            in
            <span className="results-location">{this.state.currentResults.location}</span>
          </h4>
          <div className="feature-results">
          {/* {adsImg.map((img, index) => (
            <AdsCard
              key={index}
              classname={img.orientation}
              imgclass={img.imagefit}
              src={img.url}
              alt={img.url}
              title={"Some Ads Title"}
              sub={"Now or Never"}
              subposition={{x: 0, y:25, align: img.textalign}}
              link={"at Kool Cusine"}
              linkposition={{x: 0, y:80, align: img.textalign}}
              font={`font-${index > 5?index-4:index} wh bold upper`}
            />
          ))} */}
          </div>
          <div className="location-section">
            <h4 className="results-title wh-bg">
              <strong>Places</strong> for
              <span className="results-keywords">{this.state.currentResults.keyword}</span>
               in
              <span className="results-location">{this.state.currentResults.location}</span>
            </h4>
            <div className="location-results">
              <div className="map-results">
                <div className={this.state.isStyled ? "map-theme-toggle" : "map-theme-toggle dark"} onClick={(e) => this.onToggleTheme(e) }>
                  <FontAwesomeIcon icon="map" className="theme-icon"/>
                  <span>{this.state.isStyled ?"Light":"Dark"}</span>
                </div>
                <Map
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ display:'block', height: `480px`, width: `100%`, margin: '0 0', borderRadius: `0`, boxShadow: `0 0 6px 0 rgba(0,0,0,0.1)`, overflow: `hidden` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  markers={this.props.search.businessResults}
                  center={this.state.center}
                  isOpen={this.state.selected}
                  zoom={this.props.search.zoom}
                  onclickmarker={(e,location,id) => this.centerMap(e, location, id)}
                  isStyled={this.state.isStyled}
                />
              </div>
              <div className="list-results">
                {this.props.search.businessResults && this.props.search.businessResults.map(marker => (
                  <ResultCard
                    key={marker._id}
                    classname="card-result"
                    result={marker}
                    selected={this.state.selected}
                    centermap={(e, location, id) => this.centerMap(e, location, id)}
                    collections={collections}
                    onsave={(e, id) => this.onSave(e, id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Feed.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  search: state.search
});

export default connect(mapStateToProps, {setSearchResults, setMapCenter, setZoom, setProfile, saveToCollections })(Feed);
