import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getOpeningStatus } from '../../util/getOpeningStatus';
import './BusinessPageHeader.css';
class BusinessPageHeader extends Component {
  render() {
    const { official, price, recommended } = this.props;
    const { business_name, business_type, categories, opening_hours } = this.props.businessdata;
    const capitalize = (word) => (word.charAt(0).toUpperCase()+word.substr(1).toLowerCase());
    return (
      <div className="page-header">
        <img src="/images/img-10.jpg" alt="header" className="header-img" id="header-img"/>
        <div className="header-info">
          <div className="basic-info">
            <div className="flex-row overhead-info font-4">
              <span className="business-type">
                {business_type}
              </span>
              { official && (
                <div className="official-detail">
                  <FontAwesomeIcon icon="check-circle" className="official-icon"/>
                  <p><span>By Owner</span></p>
                </div>
              )}
            </div>
            <h1 className="business-name" onClick={(e)=>this.consoleData(e)}>
              {business_name}
            </h1>
            <div className="rating-info font-4">
            <FontAwesomeIcon icon="heart" className="recommend-icon"/>
              <span>{recommended} users recommended</span><span> • </span><span className="rating">89%</span>
            </div>
            <div className="flex-row bottom-info">
              <span className="price-keyword">
                <span className="price">
                  {[...Array(price)].map((p,i)=>(<FontAwesomeIcon icon="dollar-sign" className="price-icon" key={i}/>))}
                  {price < 4 && [...Array(4-price)].map((p,i)=>(<FontAwesomeIcon icon="dollar-sign" className="price-icon rest" key={i}/>))}
                </span>
                <span className="keywords">
                  {categories !== 0 && categories.map((cat,i) => (
                    <span className="keyword-btn" key={i}>{capitalize(cat.keyword)}</span>
                  ))}
                </span>
              </span>
              <span className={ getOpeningStatus(opening_hours).status?"open-now font-4":"open-now later font-4"}>{ getOpeningStatus(opening_hours).text}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default  BusinessPageHeader;