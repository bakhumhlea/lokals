import React, {Component} from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCertificate } from '@fortawesome/free-solid-svg-icons';
import './ListCard.css';

library.add( faUser, faCertificate )

class ListCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folowing: false,
      onHover: false
    }
  }
  onFollow(e,userid) {
    e.preventDefault();
    if (userid) {
      this.setState({following: !this.state.following});
    }
  }
  render() {
    const { following, onHover } = this.state;
    const {
      imgSrc,
      title,
      desc,
      followers,
      creator,
      uid,
      byUser
    } = this.props;
    const followBtn = !following ? (
      <button onClick={(e)=>this.onFollow(e,uid)} className="follow-btn">Follow</button>
    ):(
      <button 
        onClick={(e)=>this.onFollow(e,uid)} 
        onMouseEnter={()=>this.setState({onHover: true})} 
        onMouseLeave={()=>this.setState({onHover: false})} className="follow-btn following">
        {!onHover ? (<span>Following
        <FontAwesomeIcon icon="check" className="following-icon"/></span>):("Unfollow")}
      </button>
    );
    return (
      <div className="list-card">
        <div className="list-cover">
          <img src={imgSrc} alt="header"/>
        </div>
        <h1 className="list-title">
          <span>{title}</span>
          <span className="list-following">
          { followBtn }
            {/* <span className="followers-number">{followers} followers</span>
            {following && <FontAwesomeIcon icon="check" className="following-icon"/>} */}
          </span>
        </h1>
        <div className="list-card-detail">
          <p className="list-creator">
          <span><strong>{followers} followers</strong></span>
          <span> • </span>
          <span>By <strong>{creator}</strong><FontAwesomeIcon icon={byUser?"user":"certificate" } className="createby-icon"/></span>
          </p>
          <p className="list-desc">{desc}</p>
        </div>
      </div>
    )
  }
}

export default ListCard;
