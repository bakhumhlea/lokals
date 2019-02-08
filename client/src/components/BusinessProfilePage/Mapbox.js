import React, { Component } from 'react'
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomInfobox from '../MapComponents/CustomInfobox';
import './Mapbox.css';
import { MAPBOX_TOKEN } from '../../config/keys';

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
    nightModeOn: false,
  }
  componentDidMount() {
    const { markerdata } = this.props;
    if (markerdata) {
      this.setState({
        viewport: {
          ...this.state.viewport,
          latitude: markerdata.location.lat,
          longitude: markerdata.location.lng
        },
        markerdata: markerdata
      });
    } else {
      this.setState({
        markerdata: markerdata
      });
    }
  }
  componentWillUnmount() {
    
  }
  handleViewportChange(viewport) {
    this.setState({viewport});
  }
  toggleNightMode(e) {
    e.preventDefault();
    this.setState({nightModeOn: !this.state.nightModeOn});
  }
  render() {
    const mapstyles = [
      'streets-v8',
      'streets-v9',
      'dark-v8',
      'dark-v9'
    ];
    const markerStyle = {
      fontSize: '30px',
      color: 'rgb(0, 84, 146)',
      stroke: 'white',
      strokeWidth: 40
    }
    const navStyle = {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      top: 0,
      left: 0,
      padding: '10px'
    }
    const { viewport, markerdata, nightModeOn } = this.state;
    const { showPopup } = this.props;
    const moonColor = !nightModeOn?'white':'rgb(170, 230, 255)';
    return (
      <div className="mapbox-container">
        { markerdata && (<ReactMapGL
          { ...viewport }
          latitude={markerdata.location.lat}
          longitude={markerdata.location.lng}
          width={this.props.width || '100%'}
          mapStyle={`mapbox://styles/mapbox/${nightModeOn ? mapstyles[2]:mapstyles[0]}`}
          // mapStyle={`mapbox://styles/mapbox/${selected}`}
          onViewportChange={(viewport) => this.handleViewportChange(viewport)}
          onHover={(pointerevent)=>console.log(pointerevent)}
          mapboxApiAccessToken={ MAPBOX_TOKEN }
          minZoom={11}
          maxZoom={15}
          dragPan={false}
        >
          <div style={navStyle}>
            <NavigationControl 
              onViewportChange={(viewport) => this.handleViewportChange(viewport)}
            />
          </div>
          {showPopup && (<Popup 
            tipSize={0}
            anchor="bottom"
            offsetTop={-32}
            offsetLeft={0}
            longitude={markerdata.location.lng}
            latitude={markerdata.location.lat}
            // onClose={() => this.setState({showPopup: false})}
            closeButton={false}
            closeOnClick={true}>
            <CustomInfobox
              marker={markerdata}
              openInfoboxId={markerdata._id}
              size={'sm'}
            />
          </Popup>)}
          <Marker 
              longitude={markerdata.location.lng} 
              latitude={markerdata.location.lat} 
              offsetLeft={-15} 
              offsetTop={-30}>
              <FontAwesomeIcon icon="map-marker-alt" style={markerStyle}/>
          </Marker>
        </ReactMapGL>)}
        <div style={{width: '100%', height: '30px',paddingTop: '6px', background:'rgb(4, 51, 86)',cursor: 'pointer'}}
          onClick={(e)=>this.toggleNightMode(e)}>
          <FontAwesomeIcon icon="moon" style={{color: moonColor, margin: 'auto', fontSize: '16px', display: 'block'}}/>
        </div>
        {/* <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly',cursor:'pointer'}}>
          { mapstyles.map((style,index) => (
            <div key={index} style={{width:'30px',height:'30px',borderRadius:'50px'}}
              onClick={()=>this.setState({selected: style})}
            >
              <FontAwesomeIcon icon="dot-circle"/>
            </div>)
          )}
        </div> */}
      </div>
    )
  }
}
