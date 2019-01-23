import React, { Component } from 'react'
import './AdsCard.css';

class AdsCard extends Component {
  componentDidMount() {
    if (this.props.adsId) {
      var el = document.getElementById(this.props.adsId);
      window.onresize = () => {
        var adsWidthOrgin = el.offsetWidth;
        el.style.fontSize = `${adsWidthOrgin / 14}px`;
        console.log(el.style.fontSize);
      }
    }
  }
  render() {
    const mainclass = this.props.classname?`ads-card ${this.props.classname}`:"ads-card";
    const imgclass = this.props.imgclass?`ads-img ${this.props.imgclass}`:"ads-img";
    const { title, subtitle, adsId } = this.props;
    return (
      <div className={mainclass} id={adsId}>
        <img src={this.props.src} alt={this.props.alt} className={imgclass}/>
        <h1 className={`ads-title ${title.font}`} 
          style={{
            top: `${title.y}%`, 
            left: `${title.x}%`, 
            textAlign: title.align, 
            color: title.color,
            textDecoration: `${title.textdeco?'underline':'none'}`,
            fontWeight: `${title.fontweight?'bold':'normal'}`,
            fontStyle: `${title.fontstyle?'italic':'normal'}`,
            fontSize: `${title.size}em`,
          }}>
          {this.props.title.content}
        </h1>
        <h3 className={`ads-sub ${subtitle.font}`}
          style={{
            top: `${subtitle.y}%`, 
            left: `${subtitle.x}%`, 
            textAlign: subtitle.align, 
            color: subtitle.color,
            textDecoration: `${subtitle.textdeco?'underline':'none'}`,
            fontWeight: `${subtitle.fontweight?'bold':'normal'}`,
            fontStyle: `${subtitle.fontstyle?'italic':'normal'}`,
            fontSize: `${subtitle.size}em`,
          }}>
          {this.props.subtitle.content}
        </h3>
        {this.props.texts && this.props.texts.map((text, index) => (
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
      </div>
    )
  }
}

export default AdsCard;