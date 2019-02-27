import React, { Component } from 'react'
import ReactMapGL, { NavigationControl, Marker, Popup, LinearInterpolator, FlyToInterpolator } from 'react-map-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Mapbox.css';
import { MAPBOX_TOKEN } from '../../config/keys';
import CustomPopup from './CustomPopup';
import CustomMarker from './CustomMarker';

export default class Mapbox extends Component {
  state = {
    viewport: {
      width: '100%',
      height: 200,
      zoom: 13,
      latitude: 37.7577,
      longitude: -122.4376,
      bearing: 0,
      pitch: 0,
    },
    selected: 'streets-v8',
    markerdata: null,
    activePopup: 9,
    nightModeOn: false,
  }
  componentDidMount() {
    const { markerdata, mapHeight, viewport, activePopup } = this.props;
    if (viewport) {
      this.setState({
        viewport: {
          ...viewport
        },
        activePopup: activePopup,
        markerdata: markerdata
      });
    } else {
      this.setState({
        activePopup: activePopup,
        markerdata: markerdata,
      });
    }
  }
  // shouldComponentUpdate(nextProps,nextState) {
  //   return nextProps.markerdata !== this.props.markerdata;
  // }
  recenterMap = (center) => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        latitude: center.lat,
        longitude: center.lng
      }
    })
  }
  handleViewportChange(viewport) {
    this.setState({viewport});
  }
  toggleNightMode(e) {
    e.preventDefault();
    this.setState({nightModeOn: !this.state.nightModeOn});
  }
  decrement(e, index) {
    e.preventDefault();
    this.props.onDec(e);
    if (this.props.activePopup>0) this.recenterMap(this.state.markerdata[index-1].geometry.location);
  }
  increment(e, index) {
    e.preventDefault();
    this.props.onInc(e);
    if (this.props.activePopup<this.state.markerdata.length -1) this.recenterMap(this.state.markerdata[index+1].geometry.location);
  }
  render() {
    const mapstyles = [
      'streets-v8',
      'streets-v9',
      'dark-v8',
      'dark-v9'
    ];
    const navStyle = {
      zIndex: 150,
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      top: 0,
      left: 0,
      padding: '10px'
    }
    const { viewport,  nightModeOn } = this.state;
    const { showPopup,markerdata, activePopup } = this.props;
    return (
      <div className="mapbox-container">
        {<ReactMapGL
          { ...viewport }
          height={this.props.mapHeight || 200}
          width={this.props.width || '100%'}
          mapStyle={`mapbox://styles/mapbox/${nightModeOn ? mapstyles[2]:mapstyles[1]}`}
          onViewportChange={(viewport) => this.handleViewportChange(viewport)}
          // onHover={(pointerevent)=>console.log(pointerevent)}
          mapboxApiAccessToken={ MAPBOX_TOKEN }
          minZoom={6}
          maxZoom={20}
          dragPan={true}
          transitionDuration={300}
          transitionInterpolator={new LinearInterpolator()}
        >
          <div style={navStyle}>
            <NavigationControl 
              onViewportChange={(viewport) => this.handleViewportChange(viewport)}
            />
          </div>
          {showPopup && markerdata.length > 0 && activePopup+1 && markerdata.map((marker,i)=>(
            <CustomPopup
              index={i}
              key={i}
              data={marker}
              activePopup={activePopup}
              longitude={marker.geometry.location.lng}
              latitude={marker.geometry.location.lat}
              />))}
          {markerdata.length > 0 && markerdata.map((marker,i) => (
              <CustomMarker
                key={i}
                number={i}
                data={marker}
                onCenterMap={this.recenterMap}
                longitude={marker.geometry.location.lng}
                latitude={marker.geometry.location.lat}
                selectedMarker={activePopup===i}
                onClickMarker={this.props.onClickMarker}
              />
            ))}
        </ReactMapGL>}
        <div className={nightModeOn?"toggle-nightmode-btn active":"toggle-nightmode-btn"}
          onClick={(e)=>this.toggleNightMode(e)}>
          <FontAwesomeIcon icon={nightModeOn?"sun":"moon"} className="nightmode-icon"/>
        </div>
        <div className="select-business-controler">
            <span className="inc-dec-btn" onClick={(e) => this.decrement(e, activePopup)}>-</span>
            <span className="inc-dec-btn" onClick={(e) => this.increment(e, activePopup)}>+</span>
            <span className="btn btn-light" onClick={()=>this.props.getCurrentCenter({lat: viewport.latitude, lng: viewport.longitude})}>Get New Center</span>
        </div>
      </div>
    )
  }
}
