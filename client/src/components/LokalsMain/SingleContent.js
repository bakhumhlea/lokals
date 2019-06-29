import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SingleContent.css';

class SingleContent extends Component {
  state = {
    translate: 0,
    data : [],
    displayIndex: 0,
  }
  componentDidMount() {
    const { data } = this.props;
    this.setState({
      data: data,
    });
  }
  getFeatureIcon(type) {
    switch (type) {
      case "event":
        return {
          icon: "calendar-alt",
          color: "rgb(156, 43, 174)"
        };
      case "spacial":
        return {
          icon: "star",
          color: "rgb(170, 47, 55)"
        };
      case "list":
        return {
          icon: "th-list",
          color: "rgb(117, 179, 57)"
        };
      default:
        return {
          icon: "map-marker-alt",
          color: "rgb(44, 212, 108)"
        };
    }
  }
  onNavigate(e, direction) {
    e.preventDefault();
    const {displayIndex, data} = this.state;
    if (direction === 'right' && displayIndex < data.length-1) {
      this.setState({translate: -(100) * (displayIndex+1), displayIndex: displayIndex+1})
    } else if (direction === 'left' && displayIndex > 0) {
      this.setState({translate: -(100) * (displayIndex-1), displayIndex: displayIndex-1})
    }
  }
  render() {
    const { width, contentTitle, contentDesc } = this.props;
    const { translate, data, displayIndex } = this.state;
    return (
      <div style={{width: `${width}%`}} className="single-content">
        <div className="section-info">
          <h1 className="section-title">{contentTitle}</h1>
          <p className="section-desc">
            {contentDesc}
          </p>
        </div>
        <div className="display-frame">
          <div className="feature-content" style={{transform: `translateX(${translate}%)`}}>
            {data.map((obj, i) => (
              <span style={{width: `100%`}} key={i} className="display-canvas">
                <div className="top-info">
                  <div className="card-buttons">
                    <span className="ctrl-btn" style={{
                      background: this.getFeatureIcon(obj.feature).color,
                      border: `1px solid ${this.getFeatureIcon(obj.feature).color}`
                      }}>
                      <FontAwesomeIcon icon={this.getFeatureIcon(obj.feature).icon}/>
                      {obj.feature}
                    </span>
                  </div>
                  <div className="card-buttons">
                    <span className={obj.save?"ctrl-btn activated":"ctrl-btn"}>
                      <FontAwesomeIcon icon="heart"/>
                      {obj.save?"Saved":"Save"}
                    </span>
                    <span className="ctrl-btn">
                      <FontAwesomeIcon icon="share"/>
                      Share
                    </span>
                  </div>
                </div>
                <div className="vignette"></div>
                <div className={`card-container ${obj.fit}`} 
                  style={{backgroundImage: `url(${obj.url})`}}
                >
                  {obj.texts && obj.texts.map((text, index) => (
                    <p 
                      key={index}
                      className={`ads-text ${text.font}`}
                      style={{
                        top: `${text.y}%`,
                        left: `${text.x}%`, 
                        textAlign: text.align,
                        color: text.color,
                        textDecoration: `${text.textdeco?'underline':'none'}`,
                        fontWeight: `${text.fontweight?'bold':'normal'}`,
                        fontStyle: `${text.fontstyle?'italic':'none'}`,
                        fontSize: `${text.size}em`,
                      }}
                    >
                      {text.content}
                    </p>
                  ))}
                  <div className="bg-filter"></div>
                </div>
                <div className="footer-info">
                  <div className="card-info">
                    <div className="logo-thumbnail"></div>
                    { obj.business_name ? (
                      <div className="business-link">
                        <p className="main"><span>{obj.business_name}</span></p>
                        <p className="sub"><span>{obj.business_type}</span> in <span>{obj.neighbourhood}</span></p>
                      </div>
                    ):(
                      <div className="business-link">
                        <p className="main">by <span>{obj.writer_name}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </span>
            ))}
          </div>
        </div>
        { data.length > 1 && (<div className="navigate-btn">
          <span onClick={(e)=>this.onNavigate(e, 'left')} className={displayIndex===0?"direction-btn hidden":"direction-btn"}>
            <FontAwesomeIcon icon="arrow-left"/>
          </span>
          <span className="dot-navigator">
            {Array.from('d'.repeat(data.length)).map((classname, i) => (
              <div className={`${classname} ${i === displayIndex?'scaled':''}`} key={i}></div>
            ))}
          </span>
          <span onClick={(e)=>this.onNavigate(e, 'right')} className={displayIndex===data.length-1?"direction-btn hidden":"direction-btn"}>
            <FontAwesomeIcon icon="arrow-right"/>
          </span>
        </div>)}
      </div>
    )
  }
}
export default SingleContent;
