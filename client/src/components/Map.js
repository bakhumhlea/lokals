import React, { Component } from 'react'
import {  withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faFireAlt } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import { iconSm } from './MapComponents/CustomMarkers';
import CustomInfobox from './MapComponents/CustomInfobox';
import { darkTheme, lightTheme } from './MapComponents/MapStyles';
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");

library.add( faFireAlt, fab);
const SF = {lat: 37.7749, lng: -122.4194};

class Map extends Component {
  onClickMarker(location, id, name, hours) {
    if (this.props.onclickmarker) {
      this.props.onclickmarker(null, location, id);
    }
    console.log(name);
  }
  locateCenter = (map, center) => {
    map.panTo(center);
  };
  render() {
    const icon = {
      size: new window.google.maps.Size(32, 32),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(16, 32)
    };
    icon.url = 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(iconSm);
    const { center } = this.props;
    const isStyled = this.props.isStyled ? darkTheme : lightTheme;
    const markersLocation = this.props.markers.map((marker, index) => (
      <Marker
        defaultAnimation={true}
        clickable={true}
        onClick={() => this.onClickMarker(marker.location, marker._id, marker.business_name, marker.opening_hours)}
        position={marker.location}
        key={index}
        animation={window.google.maps.Animation.DROP}
        title={marker.business_name}
        icon={icon}
      >
        {
          this.props.openInfobox && 
          <InfoBox
            onClick={()=>console.log(marker.business_name)}
            options={{
              pane: "overlayLayer",
              pixelOffset: new window.google.maps.Size(-75, -35),
              alignBottom: true,
              boxStyle: {
                boxShadow: `0px 1px 5px rgba(0,0,0,0.3)`,
              },
              closeBoxURL : ""
            }}>
            <CustomInfobox
              marker={marker}
              openInfoboxId={this.props.openInfobox}
              size={this.props.infobox}
            />
          </InfoBox>
        }
      </Marker>
    ));
  return (
    <GoogleMap
      ref={(map) => map && center && this.locateCenter(map, center)}
      defaultZoom={11}
      defaultCenter={SF}
      zoom={this.props.zoom}
      center={center}
      options={{
        styles: isStyled ,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: this.props.fullScreenCtrl,
        zoomControl: false,
        gestureHandling: this.props.gestureHandling,
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