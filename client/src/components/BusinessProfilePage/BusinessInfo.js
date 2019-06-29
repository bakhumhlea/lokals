import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getOpeningStatus } from '../../util/getOpeningStatus';
import { toAmPm, toDayStr, getStreetAddress } from '../../util/stringFormat';
import './BusinessInfo.css';
import LokalsMapbox from '../LokalsMapbox/LokalsMapbox';


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
    const { formatted_address, opening_hours} = this.props.businessdata;
    const { opening } = this.state;
    return (
      <div className="content col-right bg-wh" id="mapbox-container">
        <LokalsMapbox
          markers={new Array(marker[0])}
          showMarkerNumber={false}
          staticMap={true}
          showPopup={false}
          viewport={{
            width: '100%',
            height: '100%',
            zoom: 15,
            latitude: marker[0].location.lat,
            longitude: marker[0].location.lng,
            bearing: 0,
            pitch: 0,
          }}
          singleMarker={{
            latitude: marker[0].location.lat,
            longitude: marker[0].location.lng,
          }}
          containerClass={'info-map'}
        />
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
