import React, { Component } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faThList, faCalendarAlt, faWineGlassAlt, faGlassMartini } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios';
import { capitalize, makeTitle } from '../../util/stringFormat';
import RowContent from './RowContent';
import SingleContent from './SingleContent';
import { WEATHER_REPORT_TOKEN } from "../../config/keys";
import { getWeatherIcon } from '../../util/switchIcon';
import Mapbox from '../Mapbox/Mapbox';
import './LokalsMain.css'

library.add( faArrowLeft, faArrowRight, faThList, faCalendarAlt, faWineGlassAlt, faGlassMartini );

class LokalsMain extends Component {
  state = {
    h: null,
    m: null,
    weather: null,
    markers: null,
    activePopup: 9,
    currentCenter: null,
  }
  timer = null;

  componentDidMount() {
    const currentTime = new Date(Date.now());
    this.setState({
      h:currentTime.getHours(),
      m:currentTime.getMinutes()<10?`0${currentTime.getMinutes()}`:currentTime.getMinutes()
    })
    this.timer = setInterval(()=>{
      const now = new Date(Date.now());
      this.setState({
        h:now.getHours(),
        m:now.getMinutes()<10?`0${now.getMinutes()}`:now.getMinutes()
      });
      this.getWeatherReport();
    }, 30000);
    this.getWeatherReport();
    this.getNearbyPlaces();
  }
  componentWillUnmount() {
    clearImmediate(this.timer);
  }
  setCurrentLocation = (location) => {
    // console.log(location);
    this.setState({currentCenter:location})
  }
  getNearbyPlaces(keyword, type, location, radius) {
    console.log(location);
    const sf = {lat: 37.7749, lng: -122.4194};
    const kw = keyword || 'japanese';
    const ty = type || 'restaurant';
    const loc = location || sf;
    const rad = radius || 1000;
    Axios.get(`/api/business/searchnearby/${kw}/${ty}/${loc.lat}/${loc.lng}/${rad}`)
      .then(res => {
        console.log(res.data);
        return this.setState({markers: res.data});
      })
      .catch(err => console.log(err.response.data));
  }
  getWeatherReport(location) {
    const sf = {lat: 37.7749, lng: -122.4194}
    const coordinate = location || sf;
    Axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${coordinate.lat}&lon=${coordinate.lng}&units=${'imperial'}&APPID=${WEATHER_REPORT_TOKEN}`)
      .then(res => {
        console.log(res.data);
        return this.setState({weather: res.data})
      })
      .catch(err => console.log(err));
  }
  decrement = (e) => {
    e.preventDefault();
    const {activePopup} = this.state;
    if (activePopup > 0) {
      this.setState({activePopup: activePopup-1});
    }
  }
  increment = (e) => {
    e.preventDefault();
    const {markers, activePopup} = this.state;
    if (activePopup < markers.length-1) {
      this.setState({activePopup: activePopup+1});
    }
  }
  onClickMarker = (index) => {
    console.log(index);
    this.setState({activePopup: index});
  }
  render() {
    const {h,m,activePopup} = this.state;
    const weatherText = this.state.weather && capitalize(this.state.weather.weather[0].description);
    const weatherIcon = (this.state.weather && <FontAwesomeIcon icon={getWeatherIcon(this.state.weather)} className="weather-icon"/>);
    const weatherIonicon = (this.state.weather && <ion-icon name={getWeatherIcon(this.state.weather)} style={{transform: `translateY(3px) scale(1.1)`}}></ion-icon>);
    return (
      <div className="lokals-main">
        <div className="main-header" style={{backgroundImage: `url(${"/images/img-23.jpg"})`}}>
          <div className="greeting-texts">
            <p className="current-time">
              <span className="time-display">{`${h>12?h%12:h}:${m} ${h>=12?"PM":"AM"}`}</span>
              <span className="cap weather-text">{weatherText && makeTitle(weatherText)}</span>
              <span>{weatherIonicon}</span>
            </p>
            <h2 className="greeting">
              <span>What’s a great night</span><br/>
              <span>in San Francisco</span>
            </h2>
            <p className="brief">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="gradiant-bottom"></div>
        </div>
        <div className="main-highlight">
          <div className="mix-content-row">
            <SingleContent 
              contentTitle="Features Today"
              contentDesc="News, Events and Spacial Offer crafted for your here"
              width={58}
              data={[
                { feature: "spacial",
                  url: "/images/img-04.jpg", 
                  fit: "bg-fit-w",
                  business_name: "Lingard's Stylish",
                  business_type: "cloth store",
                  formatted_address: "1230 Taylor St",
                  neighbourhood: "Nob hill",
                  texts: [
                    { content: "SALE",
                      color: "white",
                      x: 30,
                      y: 35,
                      align: 'left',
                      font: "font-8",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 3.5},
                    { content: "20%OFF*",
                      color: "white",
                      x: 30,
                      y: 53,
                      align: 'left',
                      font: "font-8",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 3.5},
                    { content: "Now - 31 March",
                      color: "white",
                      x: 30,
                      y: 68,
                      align: 'left',
                      font: "font-8",
                      fontweight: false,
                      fontstyle: false,
                      textdeco: false,
                      size: 1.6}
                  ]},
                { feature: "list",
                  url: "/images/img-20.jpg", 
                  fit: "bg-fit-w",
                  writer_name: "Lokals's Team",
                  texts: [
                    { content: "Late Night",
                      color: "white",
                      x: 0,
                      y: 40,
                      align: 'center',
                      font: "font-3",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 3},
                    { content: "Chill Bars",
                      color: "white",
                      x: 0,
                      y: 55,
                      align: 'center',
                      font: "font-3",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 3}
                  ]},
                {url: "/images/img-24.jpg", fit: "bg-fit-w"},
                {url: "/images/img-18.jpg", fit: "bg-fit-w"}
              ]}
            />
            <SingleContent 
              contentTitle="Crafted For You"
              contentDesc="Everything you may love"
              width={40}
              data={[
                { feature: "event",
                  save: true,
                  url: "/images/img-24.jpg", 
                  fit: "bg-fit-w",
                  business_name: "Trussadi Restaurante",
                  business_type: "restaurant and bar",
                  formatted_address: "2230 Powell St",
                  neighbourhood: "North Beach",
                  texts: [
                    { content: "Full Course",
                      color: "white",
                      x: 5,
                      y: 37,
                      align: 'left',
                      font: "font-8",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 2},
                    { content: "Wine Pairing Dinner",
                      color: "white",
                      x: 5,
                      y: 48,
                      align: 'left',
                      font: "font-8",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 2},
                    { content: "Trussadi Restaurante | Union Square, San Francisco",
                      color: "white",
                      x: 5,
                      y: 59,
                      align: 'left',
                      font: "font-1",
                      fontweight: false,
                      fontstyle: false,
                      textdeco: false,
                      size: 0.8},
                    { content: "$99/person* | Limited 24 Guests",
                      color: "white",
                      x: 5,
                      y: 66,
                      align: 'left',
                      font: "font-2",
                      fontweight: false,
                      fontstyle: false,
                      textdeco: false,
                      size: 0.8},
                    { content: "Saturday, March, 24th",
                      color: "white",
                      x: 5,
                      y: 27,
                      align: 'left',
                      font: "font-2",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 1}
                  ]},
                  { feature: "spacial",
                  url: "/images/img-10.jpg", 
                  fit: "bg-fit-w",
                  business_name: "West Coast Wine • Cheese",
                  business_type: "wine bar",
                  formatted_address: "2165 Union St",
                  neighbourhood: "Cow Hollow",
                  texts: [
                    { content: "HAPPY HOURS",
                      color: "white",
                      x: 0,
                      y: 30,
                      align: 'center',
                      font: "font-8",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 2},
                    { content: "FIRST 2 HOURS",
                      color: "white",
                      x: 0,
                      y: 40,
                      align: 'center',
                      font: "font-7",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 2},
                    { content: "WEEKDAYS",
                      color: "white",
                      x: 0,
                      y: 50,
                      align: 'center',
                      font: "font-7",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 2},
                    { content: "$2 Off Selected wine by th glass*",
                      color: "white",
                      x: 0,
                      y: 62,
                      align: 'center',
                      font: "font-4",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 1},
                    { content: "20% Off when you buy a bottle*",
                      color: "white",
                      x: 0,
                      y: 70,
                      align: 'center',
                      font: "font-4",
                      fontweight: true,
                      fontstyle: false,
                      textdeco: false,
                      size: 1}
                  ]},
                {url: "/images/img-11.jpg", fit: "bg-fit-w"}
              ]}
            />
          </div>
          <RowContent
            contentTitle="Your Collections"
            contentDesc="Lorem Ipsum blah blah blah"
            data={[
              { business_name: "West Coast Wine • Cheese",
                business_type: "wine bar",
                categories: [
                  {_id: "5c23f3c0c2c98e0baca46be1", keyword: "wine"}, 
                  {_id: "5c23f3c0c2c98e0baca46be0", keyword: "beer"}, 
                  {_id: "5c23f3c0c2c98e0baca46bdf", keyword: "food"}, 
                  {_id: "5c23f3c0c2c98e0baca46bde", keyword: "cheese and charcuterie"}],
                formatted_address: "2165 Union St, San Francisco, CA 94123, USA",
                neighbourhood: "Russian Hill",
                location: {lat: 37.797059, lng: -122.434896},
                url: "/images/img-29.jpg", 
                fit: "bg-fit-h"},
              { business_name: "The Private Lounge",
                business_type: "bar",
                categories: [
                  {_id: "5c23f3c0c2c98e0baca46be1", keyword: "cocktail"}, 
                  {_id: "5c23f3c0c2c98e0baca46be0", keyword: "comfort food"}, 
                  {_id: "5c23f3c0c2c98e0baca46bdf", keyword: "american"}],
                formatted_address: "1830 Francisco St, San Francisco, CA 94123, USA",
                neighbourhood: "North Beach",
                location: {lat: 37.797059, lng: -122.434896},
                url: "/images/img-30.jpg", fit: "bg-fit-h"},
              { business_name: "Bucharatti",
                business_type: "Restaurant",
                categories: [
                  {_id: "5c23f3c0c2c98e0baca46be1", keyword: "italian"}, 
                  {_id: "5c23f3c0c2c98e0baca46be0", keyword: "french"}, 
                  {_id: "5c23f3c0c2c98e0baca46bdf", keyword: "fine dining"}],
                formatted_address: "2230 Columbus Ave, San Francisco, CA 94123, USA",
                neighbourhood: "North Beach",
                location: {lat: 37.797059, lng: -122.434896},
                url: "/images/img-31.jpg", fit: "bg-fit-w"},
              { business_name: "Italian Homemade",
                business_type: "restaurant",
                categories: [
                  {_id: "5c23f3c0c2c98e0baca46be1", keyword: "italian"}, 
                  {_id: "5c23f3c0c2c98e0baca46be0", keyword: "pasta"}, 
                  {_id: "5c23f3c0c2c98e0baca46bdf", keyword: "homemade"}],
                formatted_address: "1723 Union St, San Francisco, CA 94123, USA",
                neighbourhood: "Cow Hollow",
                location: {lat: 37.797059, lng: -122.434896},
                url: "/images/img-18.jpg", fit: "bg-fit-h"},
              { business_name: "Bulgogi House",
                business_type: "restaurant",
                categories: [
                  {_id: "5c23f3c0c2c98e0baca46be1", keyword: "korean"}, 
                  {_id: "5c23f3c0c2c98e0baca46be0", keyword: "authentic cusine"}, 
                  {_id: "5c23f3c0c2c98e0baca46bdf", keyword: "asian"}],
                formatted_address: "745 Levenworth St, San Francisco, CA 94103, USA",
                neighbourhood: "Lower Nob Hill",
                location: {lat: 37.797059, lng: -122.434896},
                url: "/images/img-12.jpg", fit: "bg-fit-h"},
              {url: "/images/img-11.jpg", fit: "bg-fit-h"},
              {url: "/images/img-13.jpg", fit: "bg-fit-h"},
              {url: "/images/img-09.jpg", fit: "bg-fit-h"},
            ]}
            col={4}
          />
          <div className="mix-content-row">
            <SingleContent 
              contentTitle="Places"
              contentDesc=""
              width={31}
              data={[
                {url: "/images/img-26.jpg", fit: "bg-fit-h"}
              ]}
            />
            <SingleContent 
              contentTitle="Activities"
              contentDesc=""
              width={31}
              data={[
                {url: "/images/img-27.jpg", fit: "bg-fit-h"}
              ]}
            />
            <SingleContent 
              contentTitle="New and Spacials"
              contentDesc=""
              width={31}
              data={[
                {url: "/images/img-28.jpg", fit: "bg-fit-w"}
              ]}
            />
          </div>
          <RowContent
            contentTitle="Not Too Far Away"
            contentDesc="Lorem Ipsum blah blah blah"
            col={5}
            data={[
              {url: "/images/img-02.jpg", fit: "bg-fit-h"},
              {url: "/images/img-03.jpg", fit: "bg-fit-h"},
              {url: "/images/img-04.jpg", fit: "bg-fit-h"},
              {url: "/images/img-05.jpg", fit: "bg-fit-h"},
              {url: "/images/img-06.jpg", fit: "bg-fit-h"},
            ]}
          />
          <div className="place-nearby-section">
            {this.state.markers && <Mapbox
              markerdata={this.state.markers}
              mapHeight={320}
              showPopup={true}
              activePopup={activePopup}
              onClickMarker={this.onClickMarker}
              getCurrentCenter={this.setCurrentLocation}
              onInc={this.increment}
              onDec={this.decrement}
              viewport={
                {
                  zoom: 13,
                  latitude: this.state.markers[activePopup].geometry.location.lat,
                  longitude: this.state.markers[activePopup].geometry.location.lng,
                  bearing: 0,
                  pitch: 0,
                }
              }
            />}
          </div>
          <button className="btn btn-warning" onClick={(e)=>this.getNearbyPlaces('bar','bar',this.state.currentCenter,1000)}>Search this area</button>
        </div>
      </div>
    )
  }
}

export default LokalsMain;
