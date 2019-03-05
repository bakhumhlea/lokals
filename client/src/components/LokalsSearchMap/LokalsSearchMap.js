import React, { Component } from 'react'
import LokalsMapbox from '../LokalsMapbox/LokalsMapbox';
import Axios from 'axios';
import { GOOGLE_MAP_API } from '../../config/keys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../reusable/Spinner';

const SF = {lat: 37.7749, lng: -122.4194};

class LokalsSearchMap extends Component {
  state = {
    keyword: '',
    type: '',
    opennow: false,
    markers: null,
    showPopup: true,
    selectedMarker: null,
    currentMapCenter: null,
    currentSearchCenter: null,
    searchRadius: 1000,
    mapviewport: {
      width: '100%',
      height: '100%',
      zoom: 13,
      latitude: null,
      longitude: null,
      bearing: 0,
      pitch: 0,
    }
  }
  componentDidMount() {
    const backToTopBtn = document.getElementById("back_to_top");
    window.onscroll = function() {
      console.log(window.pageYOffset);
      if (window.pageYOffset > 250) {
        backToTopBtn.style.opacity = 1;
        backToTopBtn.style.transform = 'translate(-50%, 0%)';
      } else {
        backToTopBtn.style.opacity = 0;
        backToTopBtn.style.transform = 'translate(-50%, -120%)';
      }
    }; 
    var currentLocation = null;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.getNearbyPlaces('food', 'restaurant', currentLocation , 1000 , null);
        }
      );
    } else {
      this.getNearbyPlaces('food', 'restaurant', null , 1000 , null);
    }
  }
  scrollTop(e) {
    e.preventDefault();
    window.scrollTo(0,0);
  }
  onChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }
  getCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => alert(`${position.coords.latitude}, ${position.coords.longitude}`)
      );
    }
  }
  getCurrentMapCenter(center, zoom) {
    var searchRadius = Math.ceil(1000 + (((13 - zoom)) * 300));
    this.setState({
      currentMapCenter: center,
      searchRadius: searchRadius
    });
  }
  getNearbyPlaces(keyword, type, location, radius, e) {
    if (e) e.preventDefault();
    const kw = keyword && keyword.length !== 0 ?  keyword : 'all';
    const ty = type && type.length !== 0  ? type : 'restaurant';
    const loc = location || SF;
    const rad = radius || this.state.searchRadius;
    const { opennow } = this.state;
    Axios.get(`/api/business/searchnearby/${kw}/${ty}/${loc.lat}/${loc.lng}/${rad}/${opennow}`)
      .then(res => {
        if (res.data.length !== 0) {
          return this.setState({
            mapviewport: {
              ...this.state.mapviewport,
              latitude: res.data[0].geometry.location.lat,
              longitude: res.data[0].geometry.location.lng,
            },
            currentMapCenter: {
              lat: res.data[0].geometry.location.lat,
              lng: res.data[0].geometry.location.lng
            },
            currentSearchCenter: {
              lat: res.data[0].geometry.location.lat,
              lng: res.data[0].geometry.location.lng
            },
            markers: res.data,
            selectedMarker: 0,
          });
        } else {
          return this.setState({
            mapviewport: {
              ...this.state.mapviewport,
              latitude: SF.lat,
              longitude: SF.lng,
            },
            currentMapCenter: {
              lat: SF.lat,
              lng: SF.lng
            },
            currentSearchCenter: {
              lat: SF.lat,
              lng: SF.lng
            },
            markers: [],
            selectedMarker: null,
          });
        }
      })
      .catch(err => console.log(err.response.data));
  }
  handleClickMarker(id) {
    this.setState({
      selectedMarker: id
    });
  }
  toggleFilter(e) {
    e.preventDefault();
    this.setState({[e.target.name]: !this.state[e.target.name]});
  }
  calculateStar(rating, star) {
    if (star < rating) {
      return {
        class: "shine",
        icon: 'star',
      };
    } else if (star > rating && star-0.5 <= rating) {
      return {
        class: "shine",
        icon: 'star-half',
      };
    } else {
      return {
        class: "no-star",
        icon: false,
      }
    }
  }
  render() {
    const { mapviewport ,keyword, type, selectedMarker, showPopup, markers, currentMapCenter, currentSearchCenter, searchRadius } = this.state;
    const displayMap = !mapviewport.latitude ? 
      <div className="map-container-empty">
        <Spinner
          spinnerStyle={{
            top: '50%',
            right: '0',
            width: '100%',
            height: 'max-content',
            position: 'absolute',
            color: 'white'
          }}/>
      </div>
      : 
      <LokalsMapbox
          markers={markers}
          showPopup={showPopup}
          selectedMarker={selectedMarker}
          onClickMarker={(id)=>this.setState({selectedMarker: id})}
          currentMapCenter={currentMapCenter}
          currentSearchCenter={currentSearchCenter}
          getViewportProps={
            (mapviewport) => this.getCurrentMapCenter({
              lat: mapviewport.latitude, 
              lng: mapviewport.longitude
            }, mapviewport.zoom )
          }
          viewport={mapviewport}
          containerStyle={{
            top: '70px',
            right: '7.5vw',
            width: `calc(85vw * 60 / 100)`,
            height: `calc(100vh - 70px)`,
            position: 'fixed',
            overflow: 'hidden',
            // border: '1px solid white',
            // borderRadius: '4px',
            // padding: '4px',
            background: 'white',
            // boxShadow: '0 0 10px 0 rgba(0,0,0,0.3)'
          }}
      />;
    console.log(markers);
    const displayList = !markers ? 
      <div className="loading-results">
        <Spinner
          spinnerStyle={{
            top: '50%',
            left: '50%',
            width: '100%',
            height: '40px',
            position: 'absolute',
            color: 'rgb(22, 212, 136)',
            transform: 'translate(-50%,-50%)'
          }}/>
      </div>
      : 
      markers.map((marker,i) => (
        <div 
          className="result-item"
          key={i}
          onMouseOver={() => this.handleClickMarker(i)}
        >
          <div className="img-col">
            {marker.photos && marker.photos[0] && 
              <img 
                style={marker.photos[0].height > marker.photos[0].width ? { width: `100%`}:{ height: `100%`}}
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${marker.photos[0].photo_reference}&key=${GOOGLE_MAP_API}`} alt={"Good Job"}
              />}
          </div>
          <div className="info-col" key={marker.id}>
            <p className="name">{marker.name}</p>
            <p className="rating">
              <span className="stars">{[1,2,3,4,5].map((star,i)=>(
                this.calculateStar(marker.rating, star).icon && (
                  <FontAwesomeIcon 
                    icon={this.calculateStar(marker.rating, star).icon} 
                    key={i} className={this.calculateStar(marker.rating, star).class}
                  />)
                ))}
              </span>
              <span className="user-count"> ({marker.user_ratings_total})</span>
              <FontAwesomeIcon icon={["fab", "google"]} className="src"/>
            </p>
            <p className="address">
              {marker.vicinity.split(',')[0]}, {marker.plus_code.compound_code.split(',')[0].split(' ').slice(1).join(' ')}
            </p>
            <p className="category">{}</p>
          </div>
        </div>
      ));
    return (
      <div className="lokals-search-map" id="page_002">
        <div className="display-col">
          <button id="back_to_top" className="back-to-top-btn" onClick={(e)=>this.scrollTop(e)}>
            <svg width="30" height="40" stroke="white" fill="transparent" strokeWidth="1">
              <path d="M7 7 L15 0 L23 7" />
              <path d="M15 0 L15 17" />
            </svg>
          </button>
          <div className="search-map-bar">
            <form onSubmit={(e)=>this.getNearbyPlaces(keyword,type,currentMapCenter, searchRadius , e)}>
              <div className="input-box">
                <div className="input-group">
                  <label>Looking for</label>
                  <input type="text" className="inp typing" name="keyword" onChange={(e)=>this.onChange(e)} placeholder="Anything" value={keyword}/>
                  {/* <FontAwesomeIcon icon="times-circle"/> */}
                </div>
                <div className="input-group">
                  <label>Business Type</label>
                  <input type="text" className="inp typing" name="type" onChange={(e)=>this.onChange(e)} placeholder="Restaurant" value={type}/>
                </div>
                <div className="input-group filter">
                  <label>Filters</label>
                  <div className="filter-group">
                    <button className="toggle-filter price">$</button>
                    <button className="toggle-filter price">$$</button>
                    <button className="toggle-filter price">$$$</button>
                    <button className={this.state.opennow?"toggle-filter opennow active":"toggle-filter opennow"} onClick={(e)=>this.toggleFilter(e)} name="opennow">Open Now</button>
                  </div>
                </div>
                <button type="submit" className="inp submit">
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
          <div className="display-items">
            { displayList }
          </div>
        </div>
        { displayMap }
      </div>
    )
  }
}

export default LokalsSearchMap;