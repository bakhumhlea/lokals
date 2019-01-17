import React, { Component } from 'react'
// import { compose, withProps } from 'recompose'
import {  withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faFireAlt } from '@fortawesome/free-solid-svg-icons'
// import { getOpeningStatus } from '../util/getOpeningStatus';
import OpenTime from './OpenTime';
import { connect } from 'react-redux';
// import markerIcon from '../images/svg/Artboard 1.svg'
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");

library.add( faFireAlt, fab);
 
var mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{
      "visibility": "on"
    },{color: '#d59563'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}]
  }
];
const SF = {lat: 37.7749, lng: -122.4194};

// const infowindow = (
// <InfoWindow 
//   onCloseClick={() => infoShow(SF)}
//   position={position}
//   visible={show}
// >
//   {props.icon}
// </InfoWindow>);

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {
    
  }
  
  onClickMarker(location, id, name, hours) {
    this.props.onclickmarker(null, location, id);
  }
  locateCenter = (map, center) => {
    map.panTo(center);
  };
  render() {
    const centerLocation = this.props.center;
    const markersLocation = this.props.markers.map((marker, index) => (
    <Marker
      // defaultLabel={marker.business_name}
      defaultAnimation={true}
      clickable={true}
      onClick={() => this.onClickMarker(marker.location, marker._id, marker.business_name, marker.opening_hours)}
      position={marker.location}
      key={index}
      title={marker.business_name}
    >
      { this.props.isOpen && <InfoBox
        // onCloseClick={() => console.log("Close Info box")}
        options={{
          pane: "overlayLayer",
          pixelOffset: new window.google.maps.Size(-60, -44),
          alignBottom: true,
          boxStyle: {
            boxShadow: `0px 1px 5px rgba(0,0,0,0.6)`,
          },
          closeBoxURL : ""
      }}
      >
        <div key={marker._id} style={{display: `${this.props.isOpen === marker._id? "block": "none"}`, backgroundColor: `white`, borderRadius: `4px`, padding: `4px 6px`, width: `120px` }}>
          <div style={{ fontSize: `0.7rem`, fontColor: `#08233B`, fontFamily: `'PT Sans', sans-serif`, textAlign: 'left' , display: 'flex', flexDirection: 'row', alignItems: `center`, width: `100%`}}>
            <div className="col-left" style={{width: `25px`, height: `25px`, padding: `4px 0 0 0`, margin: `0 auto`, background: `rgb(241, 241, 241)`, borderRadius: `100px`,textAlign: 'center', color: 'white',fontSize: `0.8rem`, fontWeight: 700 }}>
              { marker.business_name.split(' ').map(w=> w.charAt(0)).join('').length > 2 ?
              marker.business_name.split(' ').map(w=> w.charAt(0)).join('').toUpperCase().substr(0, 2):
              marker.business_name.split(' ').map(w=> w.charAt(0)).join('').toUpperCase()}
            </div>
            <div className="col-right" style={{width: `70%`, whiteSpace: `wrap`, margin: 0, color: 'black'}}>
              <h6 className="name" style={{fontSize: `0.6rem`, fontWeight: 700, margin: 0}}>{marker.business_name}</h6>
              {/* <p className="" style={{fontSize: `0.5rem`, margin: `0`, color: `${!getOpeningStatus(marker.opening_hours).status?"red":"green"}`}}>{getOpeningStatus(marker.opening_hours).text}</p> */}
              <OpenTime
                styled={{fontSize: `0.5rem`, margin: `0`}}
                icon={false}
                hours={marker.opening_hours}
              />
            </div>
            
          </div>
        </div>
      </InfoBox>}
    </Marker>));
    const isStyled = this.props.isStyled ? mapStyle : {};
  return (
    <GoogleMap
      ref={(map) => map && this.props.center && this.locateCenter(map, centerLocation)}
      defaultZoom={11}
      defaultCenter={SF}
      zoom={this.props.zoom}
      center={centerLocation}
      options={{
        styles: isStyled ,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
        zoomControl: false,
      }}
    >
      { markersLocation }
    </GoogleMap>)
  }
};

const mapStateToProps = state => ({
  search: state.search
});
export default connect(mapStateToProps, {} )(withScriptjs(withGoogleMap(Map)));