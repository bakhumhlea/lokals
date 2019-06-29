import React, { Component } from 'react'
import ReactMapGL, { NavigationControl, Marker, LinearInterpolator } from 'react-map-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MAPBOX_TOKEN } from '../../config/keys';
import CustomPopup from './CustomPopup';
import CustomMarker from './CustomMarker';
import './LokalsMapbox.css';

const mapstyles = [
  'streets-v5',
  'streets-v9',
  'dark-v8',
  'dark-v9',
];
const LOKALS_STYLE = 'mapbox://styles/bakhumhlea/cjsp4km8x072o1fmevtwowt5x';
// const SF = {lat: 37.7749, lng: -122.4194};

const DEFAULT_MABBOX_PROPS = {
  mapstyle: mapstyles[1],
  navstyle: {
    zIndex: 150,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: 0,
    left: 0,
    padding: '20px'
  }
};
// const searchBtnStyle = {
//   display: 'flex',
//   alignItems: 'center',
//   zIndex: 100,
//   color: 'white',
//   fontFamily: 'Rubik, sans-serif',
//   fontWeight: 400,
//   fontSize: 0.8+'em',
//   textTransform: 'uppercase',
//   position: 'absolute',
//   bottom: `10px`,
//   left: '50%',
//   padding: '10px 20px',
//   transform: 'translateX(-50%)'
// };
class LokalsMapbox extends Component {
  state = {
    viewport: {
      width: '100%',
      height: 500,
      zoom: 13,
      latitude: 37.7577,
      longitude: -122.4376,
      bearing: 0,
      pitch: 0,
    },
    currentMapCenter: null,
    markers: null,
    selectedMarker: null,
    keyword: null,
    type: null
  }
  componentDidMount() {
    const { 
      viewport
    } = this.props;
    if (viewport) {
      this.setState({
        viewport : {
          ...this.state.viewport,
          latitude: viewport.latitude,
          longitude: viewport.longitude,   
          width: viewport.width || '100%',
          height: viewport.height || 200,
        },

      });
    }
  }
  // getNearbyPlaces(e, keyword, type, location, radius) {
  //   e.preventDefault();
  //   const kw = keyword && keyword.length !== 0 ?  keyword : 'all';
  //   const ty = type && type.length !== 0  ? type : 'restaurant';
  //   const loc = location || SF;
  //   const rad = radius || 1000;
  //   Axios.get(`/api/business/searchnearby/${kw}/${ty}/${loc.lat}/${loc.lng}/${rad}`)
  //     .then(res => {
  //       // console.log(res.data);
  //       return this.setState({
  //         viewport: {
  //           ...this.state.viewport,
  //           latitude: res.data[0].geometry.location.lat,
  //           longitude: res.data[0].geometry.location.lng,
  //         },
  //         markers: res.data,
  //         selectedMarker: 0,
  //         keyword: '',
  //         type: ''
  //       });
  //     })
  //     .catch(err => console.log(err.response.data));
  // }
  onChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }
  handleViewportChange(viewport, callback) {
    const { staticMap } = this.props;
    if (staticMap) {
      return
    } else {
      if (callback) {
        callback(viewport);
      }
      this.setState({
        viewport
      });
    }
  }
  handleClickMarker(location, id, callback) {
    if (callback) {
      callback(id);
    }
    this.setState({
      viewport: {
        ...this.state.viewport,
        latitude: location.lat,
        longitude: location.lng,
      },
      selectedMarker: id
    });
  }
  handleHoverMarker(callback, arg) {
    if (callback) {
      callback(arg);
    }
  }
  render() {
    const { viewport } = this.state;
    const { containerStyle, containerClass, markers, selectedMarker, getViewportProps, onClickMarker, currentMapCenter, currentSearchCenter, showPopup, showMarkerNumber, staticMap} = this.props;
    // console.log(markers);
    return (
      <div className={containerClass ?`mapbox-container ${containerClass}`:"mapbox-container"} style={containerStyle && {
        ...containerStyle}}>
        <ReactMapGL
          { ...viewport }
          mapStyle={LOKALS_STYLE}
          onViewportChange={(viewport) => this.handleViewportChange(viewport, getViewportProps)}
          mapboxApiAccessToken={ MAPBOX_TOKEN }
          minZoom={6}
          maxZoom={20}
          dragPan={!!!staticMap}
          transitionDuration={0}
          transitionInterpolator={new LinearInterpolator()}
        >
          { !!!staticMap && <div style={DEFAULT_MABBOX_PROPS.navstyle}>
            <NavigationControl 
              onViewportChange={(viewport) => this.handleViewportChange(viewport, getViewportProps)}
            />
          </div>}
          { markers && markers.length > 0 && markers.map((marker,i) => {
            let location = {};
            if (marker.location) {
              location = marker.location;
            } else {
              location.lat = marker.geometry.location.lat;
              location.lng = marker.geometry.location.lng;
            }
            return (
              <CustomMarker
                key={i}
                markerID={i}
                data={marker}
                offset={{x:-15,y:-30}}
                onClickMarker={(location, id) => this.handleClickMarker(location, id, onClickMarker)}
                onHoverMarker={(id) => this.handleHoverMarker(onClickMarker, id)}
                latitude={location.lat}
                longitude={location.lng}
                selectedMarker={selectedMarker === i}
                showMarkerNumber={showMarkerNumber}
              />
            )
          })}
          { showPopup && markers && markers.length > 0 && markers.map((marker,i) => (
            <CustomPopup
              key={i}
              popupID={i}
              offset= {{x: -4,y: -40}}
              data={marker}
              showAll={false}
              selectedPopup={selectedMarker === i}
              longitude={marker.geometry.location.lng}
              latitude={marker.geometry.location.lat}
            />
          ))}
          { currentMapCenter && currentMapCenter.lat !== currentSearchCenter.lat && (<Marker 
            className="current-pos-marker"
            latitude={viewport.latitude}
            longitude={viewport.longitude}>
            <FontAwesomeIcon icon="circle"/>
          </Marker>) }
          {/* <form onSubmit={(e)=>this.getNearbyPlaces(e,this.state.keyword,this.state.type,{lat:viewport.latitude,lng:viewport.longitude}, 1000)}>
            <div className="search-form" style={searchBtnStyle}>
              <input type="text" className="form-control" name="keyword" onChange={(e)=>this.onChange(e)} placeholder="Try Sushi" value={this.state.keyword} style={{margin: '5px'}}/>
              <input type="text" className="form-control" name="type" onChange={(e)=>this.onChange(e)} placeholder="Business Type" value={this.state.type} style={{margin: '5px'}}/>
              <button className="btn btn-danger" type="submit">
                Search this area
              </button>
            </div>
          </form> */}
          
        </ReactMapGL>
      </div>
    )
  }
}

export default LokalsMapbox;