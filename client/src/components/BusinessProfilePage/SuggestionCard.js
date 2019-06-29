import React, { Component } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faShare, faGlassMartiniAlt, faCoffee } from '@fortawesome/free-solid-svg-icons';

import './SuggestionCard.css';

library.add( faBookmark, faShare, faGlassMartiniAlt, faCoffee );

export default class SuggestionCard extends Component {
  render() {
    const { imgSrc, baseOnSearch, name, icon, type, rating, address} = this.props;
    return (
      <div className="suggestion-card">
        <div className="preference-info">
          <span className="text">Base on your search <span className="keyword">{baseOnSearch}</span></span>
          <div className="btns-rack">
            <FontAwesomeIcon icon="bookmark" className="option-btn"/>
            <FontAwesomeIcon icon="share" className="option-btn"/>
          </div>
        </div>
        <img src={imgSrc} alt="suggestion-01" className="cover-img"/>
        <div className="brief-info">
          <h1 className="name">{name}</h1>
          <div className="middle-text">
            <span>
              <FontAwesomeIcon icon={icon} className="brief-info-icon"/>
              <span className="ul-hover">{type}</span>
            </span>
            <span> • </span>
            <span className="recommended-number">
              <FontAwesomeIcon icon="heart" className="brief-info-icon"/>
              <span>{rating}</span>
            </span>
          </div>
          <div className="bottom-text">
            <span>
              <FontAwesomeIcon icon="map-marker-alt" className="brief-info-icon"/>
              <span className="ul-hover">{address}</span>
            </span>
          </div>
        </div>
      </div>
    )
  }
}
