import React, { Component } from 'react'
import Axios from 'axios';
import ReactMapGL, { Marker, LinearInterpolator } from 'react-map-gl'
import { MAPBOX_TOKEN } from '../../../config/keys';
import { makeTitle } from '../../../util/stringFormat';
import isEmpty from '../../../util/is-empty'

import CustomMarker from '../../LokalsMapbox/CustomMarker';

const LOKALS_STYLE = 'mapbox://styles/bakhumhlea/cjsp4km8x072o1fmevtwowt5x';
const SF = {lat: 37.7749, lng: -122.4194};

export default class MiniMap extends Component {
  state = {
    kw: 'thai',
    ty: 'restaurant',
    lc: 'downtown',
    ct: 'San Francisco',
    opennow: false,
    markers: null,
    showPopup: true,
    selectedMarker: null,
    cKw: 'thai',
    currentMapCenter: null,
    currentSearchCenter: null,
    searchRadius: 1000,
    mapviewport: {
      width: '100%',
      height: '100%',
      zoom: 12,
      latitude: null,
      longitude: null,
      bearing: 0,
      pitch: 0,
    }
  }
  componentDidMount() {
    console.log(this.props.ct);
    const { kw, ct } = this.props;
    const { ty } = this.state;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        var location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.getNearUser({kw: kw}, location, ty, 1000 , false);
      });
    } else {
      this.getNearbyPlaces({kw: kw}, ty, ct, 1000 , false);
    }
    this.setState({kw: kw,ct:this.props.ct})
  }
  componentDidUpdate(prevProps, prevState) {
    const { ct, kw } = this.props;
    const { ty } = this.state;
    if (prevProps.ct !== this.props.ct) {
      this.setState({kw: kw, ct:this.props.ct})
      this.getNearbyPlaces({kw:kw}, ty, ct, 1000, false)
    } else if (prevProps.kw !== this.props.kw) {
      this.setState({kw: kw, ct:this.props.ct})
      this.getNearbyPlaces({kw:kw}, ty, ct, 1000, false)
    }
  }
  getNearUser(input,location,type,radius,opennow) {
    const params = {};
    params.kw = input.kw;
    params.ty = type;
    params.rad = radius || 1000;
    params.opn = opennow;
    Axios.get(`/api/business/searchnearuser/${params.kw}/${params.ty}/${location.lat}/${location.lng}/${params.rad}/${params.opn}]`)
      .then(res => {
        console.log(res.data);
        return this.setState({
          markers: res.data,
          currentMapCenter: {
            lat: location.lat, 
            lng: location.lng
          },
          currentSearchCenter: {
            lat: location.lat, 
            lng: location.lng
          },
          mapviewport: {
            ...this.state.mapviewport,
            latitude: location.lat,
            longitude: location.lng
          }
        });
      })
      .catch(err => console.log({error:'Error!'}))
  }
  getNearbyPlaces(input, type, city, radius, opennow) {
    // console.log(input)
    const params = {};
    params.kw = input.kw;
    params.ty = type;
    params.lc = !isEmpty(input.lc) ? input.lc : 'downtown';
    params.rad = radius || 1000;
    params.opn = opennow;
    params.ct = city;
    Axios.get(`/api/business/searchnearby/${params.kw}/${params.ty}/${params.lc}/${params.ct}/${params.rad}/${params.opn}`)
      .then(res => {
        if (res.data.length>0) {
          return this.setState({
            markers: res.data,
            currentMapCenter: {
              lat: res.data[0].geometry.location.lat, 
              lng: res.data[0].geometry.location.lng
            },
            currentSearchCenter: {
              lat: res.data[0].geometry.location.lat, 
              lng: res.data[0].geometry.location.lng
            },
            mapviewport: {
              ...this.state.mapviewport,
              latitude: res.data[0].geometry.location.lat,
              longitude: res.data[0].geometry.location.lng
            }
          });
        }
      })
      .catch(err => console.log({error: 'An unknown error occor!'}));
  }
  handleViewportChange(viewport) {
    // this.getCurrentMapCenter({
    //   lat: viewport.latitude, 
    //   lng: viewport.longitude
    // }, viewport.zoom)
    this.setState({
      currentMapCenter: {
        lat: viewport.latitude, 
        lng: viewport.longitude
      },
      mapviewport: viewport
    })
  }
  getCurrentMapCenter(center, zoom) {
    var searchRadius = Math.ceil(1000 + (((13 - zoom)) * 300));
    this.setState({
      currentMapCenter: center,
      searchRadius: searchRadius
    });
  }
  render() {
    const { mapviewport, kw, type, ct, opennow, 
      markers, cKw, currentMapCenter, currentSearchCenter, searchRadius } = this.state;
    return (
      <div className="mdl-bound mini-map">
        <h5 className="mdl-tt flx al-c">
          <span className="mr-3">On Map</span>
          <span className="lk-btn btn-war sm tx-cap mr-2">{makeTitle(ct)}</span>
          <span className="lk-btn-ol sm tx-cap mr-2">{makeTitle(kw)}</span>
        </h5>
        <div className="mdl">
          { currentMapCenter && currentMapCenter.lat !== currentSearchCenter.lat && (
            <div className="lk-btn sm redo-minimap"
              onClick={(e)=>this.getNearUser({kw: kw, lc: 'financial district'}, {lat:mapviewport.latitude,lng:mapviewport.longitude}, type, searchRadius , opennow)}>
              Redo Search
            </div>
          )}
          { mapviewport.latitude && mapviewport.longitude && (
            <ReactMapGL
              {...mapviewport}
              mapStyle={LOKALS_STYLE}
              onViewportChange={(viewport) => this.handleViewportChange(viewport)}
              mapboxApiAccessToken={ MAPBOX_TOKEN }
              minZoom={6}
              maxZoom={20}
              dragPan={true}
              trackResize={true}
              transitionDuration={0}
              transitionInterpolator={new LinearInterpolator()}
            >
            { currentMapCenter && currentMapCenter.lat !== currentSearchCenter.lat && (<Marker 
              className="current-pos-marker"
              latitude={mapviewport.latitude}
              longitude={mapviewport.longitude}>
              {/* <FontAwesomeIcon icon="circle"/> */}
              <svg width="20" height="20" fill="#c4762d" stroke="#ffffff" strokeWidth="2">
                <circle cx="10" cy="10" r="7"/>
              </svg>
            </Marker>) }
            { markers && markers.length > 0 && markers.map((marker,i)=>(
              <CustomMarker
                key={i}
                markerID={i}
                showMarkerNumber={true}
                data={marker}
                offset={{x:-15,y:-30}}
                latitude={marker.geometry.location.lat}
                longitude={marker.geometry.location.lng}
                onHoverMarker={() => console.log("Hover")}
                onClickMarker={() => console.log("Click")}
              />
            ))}
            </ReactMapGL>
          )}
        </div>
      </div>
    )
  }
}
