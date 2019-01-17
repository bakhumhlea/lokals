import React, { Component } from 'react'
import { connect } from 'react-redux';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faLocationArrow, faInfoCircle, faMapMarkerAlt ,faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons'
import TextFieldGroup from './reusable/TextFieldGroup';
import { setSearchResults, setMapCenter, setZoom } from '../actions/searchActions';

import './SearchBar.css';

library.add(faLocationArrow, faInfoCircle, faMapMarkerAlt, faTimes, faSearch, faGrinHearts, faGrinStars, faWineGlass, faBookmark, faHeart, fab);

// const SF = {lat: 37.7749, lng: -122.4194};

const INITIAL_STATE = {
  keywords: 'restaurant',
  results: [],
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    }
  }
  componentDidMount() {
    this.props.setSearchResults(this.state.keywords, 12);
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault();
    const keywords = this.state.keywords;
    this.props.setSearchResults(keywords, 13);
  }

  render() {
    return (
      <div className={this.props.classname}>
        <h2 className="happening-title">What is going on near <span className="current-location">San Francisco</span><FontAwesomeIcon icon="location-arrow"></FontAwesomeIcon></h2>
        <form onSubmit={(e) => this.onSubmit(e)}>
        <div className="form-group-inline search-group">
          <FontAwesomeIcon icon="search" className="search-icon"></FontAwesomeIcon>
          <TextFieldGroup
            type="text"
            divclass="mb-0"
            classname="input-search"
            placeholder="Find: Burger, Sushi, Wine bar, etc." 
            name="keywords"
            onChange={(e) => this.onChange(e)}
          />
          <input
            type="submit"
            className="submit-search"
            name="search"
            value="Search"
          />
          </div>
        </form>
      </div>
    )
  }
}

export default connect( null, { setSearchResults, setMapCenter, setZoom })(SearchBar);