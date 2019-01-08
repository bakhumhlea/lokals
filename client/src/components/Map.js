import React, { Component } from 'react'
// import { compose, withProps } from 'recompose'
import {  withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faFireAlt } from '@fortawesome/free-solid-svg-icons'
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

// var show = false;
// var position = {lat: 37.7749, lng: -122.4194};

const Map = withScriptjs(withGoogleMap(props => {
    // function infoShow(latlng) {
    //   show = !show;
    //   position = latlng;
    // }
    const markersLocation = props.markers.map((marker, index) => (<Marker
      // defaultLabel={marker.business_name}
      defaultAnimation={true}
      clickable={true}
      onClick={() => console.log(marker._id)}
      position={marker.location}
      key={index}
      title={marker.business_name}
    >
      {props.isOpen && <InfoBox
        // onCloseClick={() => console.log("Close Info box")}
        options={{
          pane: "overlayLayer",
          pixelOffset: new window.google.maps.Size(-40, -44),
          alignBottom: true,
          boxStyle: {
            boxShadow: `0px 1px 5px rgba(0,0,0,0.6)`,
            
          },
          closeBoxURL : ""
      }}
      >
        <div key={marker._id} style={{ backgroundColor: `white`, borderRadius: `4px`, padding: `4px`, width: `80px` }}>
          <div style={{ fontSize: `0.7rem`, fontColor: `#08233B`, fontFamily: `'PT Sans', sans-serif`, textAlign: 'center' }}>
            {marker.business_name}
          </div>
        </div>
      </InfoBox>}

    </Marker>));

    // const infowindow = (
    // <InfoWindow 
    //   onCloseClick={() => infoShow(SF)}
    //   position={position}
    //   visible={show}
    // >
    //   {props.icon}
    // </InfoWindow>);
    const locateCenter = (map, center) => {
      map.panTo(props.center);
    };
    return (
    <GoogleMap
      ref={(map) => map && props.center && locateCenter(map, props.center)}
      defaultZoom={12}
      defaultCenter={props.center ? props.center : SF}
      zoom={props.zoom}
      center={props.center? props.center : SF}
      options={{
        styles: mapStyle,
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
));

export default Map;