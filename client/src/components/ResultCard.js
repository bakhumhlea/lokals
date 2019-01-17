import React, { Component } from 'react'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faLocationArrow, faInfoCircle, faMapMarkerAlt , faClock,faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons'

import { switchIcon } from '../util/switchIcon';
import OpenTime from './OpenTime';


library.add(faLocationArrow, faInfoCircle, faMapMarkerAlt, faClock, faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart, fab);

export default class ResultCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  render() {
    const categories = this.props.result.categories.map(cat => cat.keyword).join(', ');
    const businessIcon = switchIcon(this.props.result.business_type);
    const toggleSelected = this.props.selected === this.props.result._id ? `${this.props.classname} highlight`:`${this.props.classname}`;
    const isSaved = () => this.props.collections && this.props.collections.map(col => col.business).includes(this.props.result._id) ? "save-icon saved":"save-icon";
    return (
      <div 
        className={toggleSelected} 
        key={this.props.result._id} 
        onClick={(e) => this.props.centermap(e, this.props.result.location, this.props.result._id)}
      >
        <div className="business-detail">
          <div className="head">
            <h4 className="business-name">{this.props.result.business_name}</h4>
            <p className="business-type">
              <span>
                <FontAwesomeIcon icon={businessIcon} className="business-icon"/>
              </span>
              {categories}
            </p>
          </div>
          <p className="formatted-address">
            <span>
              <FontAwesomeIcon icon="map-marker-alt" className="address-icon"/>
            </span>
            {this.props.result.address && this.props.result.address.formatted_address}
            {this.props.result.formatted_address && this.props.result.formatted_address}
          </p>
          <OpenTime
            hours={this.props.result.opening_hours}
            icon={true}
          />
        </div>
        <div className="buttons">
          <FontAwesomeIcon icon="heart" className="like-icon"/>
          <FontAwesomeIcon icon="bookmark" 
            className={isSaved()} 
            onClick={(e) => this.props.onsave(e, this.props.result._id)}/>
        </div>
      </div>
    )
  }
}
