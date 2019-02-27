import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RowContent.css';
import { capitalize, makeTitle } from '../../util/stringFormat';
import { switchIcon } from '../../util/switchIcon';

class RowContent extends Component {
  state = {
    moveRight: 0,
    translate: 0,
    hoverIndex: null,
    data: []
  }
  componentDidMount() {
    const { data } = this.props;
    this.setState({
      data: data
    });
  }
  onNavigate(e, direction) {
    e.preventDefault();
    const numOfColumn = this.props.col;
    const {moveRight, data} = this.state;
    if (direction === 'right' && moveRight < data.length-numOfColumn) {
      this.setState({translate: -(100/numOfColumn) * (moveRight+1), moveRight: moveRight+1})
    } else if (direction === 'left' && moveRight > 0) {
      this.setState({translate: -(100/numOfColumn) * (moveRight-1), moveRight: moveRight-1})
    }
  }
  render() {
    const { col, contentTitle, contentDesc } = this.props;
    const { moveRight, hoverIndex, data } = this.state;
    return (
      <div className="section-container">
        <div className="section-info">
          <h1 className="section-title">{contentTitle}</h1>
          <p className="section-desc">
            {contentDesc}
          </p>
        </div>
        <div className="section-content" style={{transform: `translateX(${this.state.translate}%)`}}>
          {data.map((obj, i) => (
            <span style={{width: `${100/col}%`}} key={i} className="chain-container"
              onMouseEnter={()=>this.setState({hoverIndex: i})}
              onMouseLeave={()=>this.setState({hoverIndex: null})}
            >
              <div 
                className={`card-container sm ${obj.fit}`} 
                style={{backgroundImage: `url(${obj.url})`}}
              > 
                <div className="top-info-bar">
                  {obj.business_type && <div className="biz-type">
                    <FontAwesomeIcon icon={switchIcon(obj.business_type)} className="biz-type-icon"/>
                    {makeTitle(obj.business_type)}
                  </div>}
                  <div className="card-buttons">
                    <span className="ctrl-btn">
                      <FontAwesomeIcon icon="star"/>
                    </span>
                    <span className="ctrl-btn">
                      <FontAwesomeIcon icon="share"/>
                    </span>
                  </div>
                </div>
                <div className="footer-info-bar">
                  <div className="biz-info">
                    <h1 className="biz-name">{obj.business_name} <span><FontAwesomeIcon icon="check"/></span></h1>
                    <p className="biz-rating">
                      <span className="info-icon"><FontAwesomeIcon icon="heart"/></span>
                      <span className="percentage">89%</span> 
                      <span>Recommend</span>
                    </p>
                    <p className="location-link">
                      <span className="info-icon"><FontAwesomeIcon icon="map-marker-alt"/></span>
                      <span>
                        <strong>{obj.formatted_address && obj.formatted_address.split(',')[0]}</strong> in <strong>{obj.neighbourhood}</strong>
                      </span>
                    </p>
                    <p className="price-keyword">
                      <span className="info-icon"><FontAwesomeIcon icon="dollar-sign"/></span>
                      <span className="price-range">Moderate</span>
                      <span className="text-seperator">•</span>
                      <span className="top-cat">{obj.categories && obj.categories.map(cat => capitalize(cat.keyword)).slice(0,1).join(', ')}</span>
                    </p>
                  </div>
                </div>
                <div className="vignette bottom"></div>
              </div>
            </span>
          ))}
        </div>
        <div className="navigate-btn">
          <span onClick={(e)=>this.onNavigate(e, 'left')} className={moveRight===0?"direction-btn hidden":"direction-btn"}>
            <FontAwesomeIcon icon="arrow-left"/>
          </span>
          <span className="dot-navigator">
            {Array.from('d'.repeat(data.length)).map((classname, i) => (
              <div className={`${classname} ${i === hoverIndex?'scaled':''}`} key={i}></div>
            ))}
          </span>
          <span onClick={(e)=>this.onNavigate(e, 'right')} className={moveRight+col===data.length?"direction-btn hidden":"direction-btn"}>
            <FontAwesomeIcon icon="arrow-right"/>
          </span>
        </div>
      </div>
    )
  }
}
export default RowContent;
