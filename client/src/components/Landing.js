import React, { Component } from 'react'
import axios from 'axios';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSpinner, faCloudRain, faBolt, faFireAlt, faGrinHearts, faGrinStars, faWineGlass, faBookmark } from '@fortawesome/free-solid-svg-icons'
import TextFieldGroup from './reusable/TextFieldGroup';
import './Landing.css';

library.add(faSpinner, faFireAlt, faGrinHearts, faGrinStars, faCloudRain, faBolt, faFireAlt, faWineGlass, faBookmark, fab);

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
      results: []
    }
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault();
    const keywords = this.state.keywords;
    axios
      .get(`/api/business/search/category/${keywords}`)
      .then(res => {
        return this.setState({results: res.data})
      })
      .catch(err => console.log(err));
  }
  render() {
    const cards = this.state.results.length>0? this.state.results.map(result => (
        <div className="card text-white bg-dark mb-3" style={{width: "75%", margin: "10px auto", textAlign: "left"}} key={result._id}>
          <div className="card-header"><FontAwesomeIcon icon="wine-glass" style={{margin: "0 10px 0 0"}} className="icon"/> {result.business_name.charAt(0).toUpperCase() + result.business_name.substr(1)}</div>
          <div className="card-body">
            <h6 className="card-title"><small>{result.business_type.charAt(0).toUpperCase() + result.business_type.substr(1)}</small></h6>
            <p className="card-text"><small>{result.formatted_address}</small></p>
            <a href="/" className="btn-d ft-d circle-btn mr-1"><FontAwesomeIcon icon="grin-stars" style={{width: "20px", display: "inline-block"}} /></a>
            <a href="/" className="btn-d ft-d circle-btn mr-1"><FontAwesomeIcon icon="bookmark" style={{width: "20px", display: "inline-block"}} /></a>
          </div>
          <div className="object-display">
            
          </div>
        </div>
      )
    ): null;
    return (
      <div className="search-form">
        <div>
          <form onSubmit={(e) => this.onSubmit(e)}>
            <TextFieldGroup
              type="text"
              classname="form-control form-control-sm bd-r-50 ft-d pr-3 pl-3"
              placeholder="Looking for: Burger, Pad Thai, Sushi, Wine bar, etc." 
              name="keywords"
              onChange={(e) => this.onChange(e)}
            />
            <input
              type="submit"
              className="form-control form-control-sm btn-d ft-d inl-b"
              name="search"
              value="Search"
            />
          </form>
        </div>
        <div className="results-group">
          {cards}
        </div>
        {this.state.results.suggestion && (<div className="no-result">
        {this.state.results.suggestion.map((keyword, index) => (<p className="btn-d" key={index}>{keyword}</p>))}
        </div>)}
        {this.state.results.businessmatched && (<div className="no-result">
        {this.state.results.businessmatched}
        </div>)}
      </div>
    )
  }
}
