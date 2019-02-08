import React, { Component } from 'react'
import './StoryCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class StoryCard extends Component {
  onClickExpand(e, storyId) {
    e.preventDefault();
    this.props.onExpend(storyId);
  }
  render() {
    const { gridSpan, display, coverImg, type, head, content, postowner, storyId, showmoreIds } = this.props;
    return (
      <div className={gridSpan ? `story-card ${gridSpan}`: `story-card c-2`}
      style={ display && {flexDirection: 'row'}}>
        <div className="story-cover"
        style={ display && {width: '50%'}}>
          <img src={coverImg} alt={"Story-cover-01"} className="img-cm"/>
        </div>
        <div className="story-info">
          <div className="col-right">
            <p className="story-detail">
              <span className="story-type">{type}</span>
              <span> • </span>
              <span className="story-timestamp">Published {2} hours ago</span>
            </p>
            <p className="story-header">
              <span>{head}</span>
            </p>
            <p className="story-caption">
              { showmoreIds.includes(storyId) ? 
                (<span>{content}<span className="expend-text-btn" onClick={(e)=>this.onClickExpand(e, storyId)}>Show less</span></span>) :
                (<span>
                  {content.split(' ', 16).join(' ') + '...'}
                  <span className="expend-text-btn" onClick={(e)=>this.onClickExpand(e, storyId)}>Read more</span>
                </span>)
              }
            </p>
            {/* <div className="story-bottom-bar">
              <FontAwesomeIcon icon="grin-hearts"/>
            </div> */}
          </div>
          <div className="col-left">
            <div className="owner-picture" style={{backgroundImage: `url(${postowner.url})`}}></div>
            <div className="owner-info">
              <p className="owner-name">By <span><strong>{postowner.name}</strong></span></p>
              <p className="owner-title">{postowner.title}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default StoryCard;
