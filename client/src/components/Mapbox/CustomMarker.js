import React from 'react'
import { BaseControl } from 'react-map-gl'
import './Mapbox.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CustomMarker extends BaseControl {
  onClickMarker(e, number) {
    e.preventDefault();
    const { data } = this.props;
    this.props.onClickMarker(number);
    this.props.onCenterMap(data.geometry.location);
  }
  onHoverMarker(e, number) {
    e.preventDefault();
    this.props.onClickMarker(number);
  }
  _render() {
    const {longitude, latitude, number} = this.props;
    const [x, y] = this._context.viewport.project([longitude, latitude]);

    const markerStyle = {
      position: 'absolute',
      left: x,
      top: y
    };
    return (
      <div 
        ref={this._containerRef}
        style={markerStyle} 
        className={this.props.selectedMarker?"custom-marker-container selected":"custom-marker-container"}
        onMouseOver={(e)=>this.onHoverMarker(e,number)}
        onClick={(e)=>this.onClickMarker(e,number)}
      >
        <FontAwesomeIcon 
          icon="map-marker" 
          className="custom-marker-icon"
          style={this.props.selectedMarker} />
        {<div className="custom-marker-number">{number+1}</div>}
      </div>
    )
  }
}
export default CustomMarker;
