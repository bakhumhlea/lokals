import React, { Component } from 'react'
import './StoryThumbnail.css';

class StoryThumbnail extends Component {
  render() {
    const { url, title, createdate, creator, isSelect } = this.props;
    return (
      <div className={isSelect?"story-object selected":"story-object"}>
        <div className="story-thumbnail">
          <img src={url} alt="story-id" className="fit-h"/>
        </div>
        <div className="story-brief font-2">
          <h6>{title}</h6>
          <p>{createdate} ago by {creator}</p>
        </div>
      </div>
    )
  }
}
export default StoryThumbnail;
