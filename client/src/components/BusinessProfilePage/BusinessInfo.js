import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Map from '../Map';
import Mapbox from './Mapbox';
import { getOpeningStatus } from '../../util/getOpeningStatus';
import { GOOGLE_MAP_API } from '../../config/keys';
import { toAmPm, toDayStr, getStreetAddress } from '../../util/stringFormat';
import './BusinessInfo.css';


export default class BusinessInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 360,
      opening: {},
      businessdata: {}
    }
    this.timer = null;
  }
  componentDidMount() {
    this.getLiveStatus();
    this.resizeMapViewPort();
    this.timer = setInterval(() => {
      this.getLiveStatus();
    },5000);
    window.onresize = this.resizeMapViewPort();
    this.setState({businessdata: this.props.businessdata});
  }
  getLiveStatus() {
    const { opening_hours } = this.props.businessdata;
    const opening = getOpeningStatus(opening_hours);
    this.setState({opening: opening});
  }
  componentWillUnmount() {
    window.onresize = null;
    clearInterval(this.timer);
  }
  resizeMapViewPort() {
    const containter = document.getElementById("mapbox-container");
    this.setState({width: containter.offsetWidth})
  }
  render() {
    const today = new Date(Date.now()).getDay();
    const { marker } = this.props;
    const { formatted_address, opening_hours, _id, location } = this.props.businessdata;
    const { opening } = this.state;
    return (
      <div className="content col-right bg-wh" id="mapbox-container">
        <Mapbox
          viewportWidth={this.state.width}
          markerdata={marker[0]}
          showPopup={false}
        />
        {/* <Map
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ display:'block', height: `200px`, width: `100%`, margin: '0px', borderRadius: `0px`, boxShadow: `0 0 6px 0 rgba(0,0,0,0.1)`, overflow: `hidden` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          markers={marker}
          center={location}
          zoom={14}
          openInfobox={_id}
          // onclickmarker={(e,location,id) => this.centerMap(e, location, id)}
          isStyled={true}
          fullScreenCtrl={false}
          gestureHandling='none'
          infobox="sm"
        /> */}
        <div className="business-info">
          <h4 className="location-info">
            <span className="localzone-info">Cow Hollow</span>
            <span className="distance-info">4.8mi</span>
            </h4>
          <div className="info-box">
            <p className="text">
              <FontAwesomeIcon icon="map-marker-alt" className="location-info-icon"/>
              <span className="cm-link">{getStreetAddress(formatted_address)}</span>
            </p>
          </div>
          <div className="info-box">
            {opening_hours.map((hour,i)=>(
              <p key={i} className={today === hour.open.day?"text hour-info hlight":"text hour-info"}>
                <FontAwesomeIcon icon="clock" className="location-info-icon"/>
                <span>
                  <span className="day-info">{toDayStr(hour.open.day)}</span>
                  <span className="time-info">{toAmPm(hour.open.time)} - {toAmPm(hour.close.time)}</span>
                  {today === hour.open.day && (<span className={opening.status?"open-status":"open-status closed"}>{opening.text}</span>)}
                </span>
              </p>
            ))}
          </div>
          <div className="info-box">
            <p className="text">
              <FontAwesomeIcon icon="utensils" className="location-info-icon"/>
              <span className="cm-link">
                View Menu
              </span>
            </p>
          </div>
          <div className="info-box">
            <p className="text">
              <FontAwesomeIcon icon="clipboard-list" className="location-info-icon"/>
              <span>
                <span className="info-title">
                  Reservation
                </span>
                <span className="info-yes">
                  Yes
                </span>
                <span className="info-note">
                  3 people or more
                </span>
              </span>
            </p>
          </div>
          <div className="info-box">
            <p className="text">
              <FontAwesomeIcon icon="wifi" className="location-info-icon"/>
              <span>
                <span className="info-title">
                  WiFi
                </span>
                <span className="info-no">
                  No
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}
