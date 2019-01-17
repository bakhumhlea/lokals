import React, { Component } from 'react'
import './AdsCard.css';

class AdsCard extends Component {
  render() {
    const mainclass = this.props.classname?`ads-card ${this.props.classname}`:"ads-card";
    const imgclass = this.props.imgclass?`ads-img ${this.props.imgclass}`:"ads-img";
    const font = (originalclass) => this.props.font? `${originalclass} ${this.props.font}`:`${originalclass}`;
    const { titleposition, subposition, linkposition } = this.props;
    return (
      <div className={mainclass}>
        <img src={this.props.src} alt={this.props.alt} className={imgclass}/>
        <h1 className={font("ads-title")} 
          style={{top: `${titleposition.y}%`, left: `${titleposition.x}%`, textAlign: titleposition.align}}>{this.props.title}</h1>
        <h3 className={font("ads-sub")}
          style={{top: `${subposition.y}%`, left: `${subposition.x}%`, textAlign: subposition.align}}>{this.props.sub}</h3>
        <p className={font("ads-link")}
          style={{top: `${linkposition.y}%`, left: `${linkposition.x}%`, textAlign: linkposition.align}}>{this.props.link}</p>
      </div>
    )
  }
}

export default AdsCard;