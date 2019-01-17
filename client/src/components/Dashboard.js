import React, { Component } from 'react'
import { connect } from 'react-redux'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faPencilAlt, faEdit, faCog, faEnvelope, faComments, faEye, faCommentAlt, faHeart, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'

import Navbar from './Navbar';

import './Dashboard.css'
import AdsCard from './AdsCard';

library.add(faPencilAlt, faEdit, faCog, faEnvelope, faComments, faEye, faCommentAlt, faHeart, faCheck, faTrash, fab);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessName: "Tatuu Fusion Bar and Tapas",
      address: "23 Market St. San Francisco, CA, 94101",
      editmode: ''
    }
  }
  onClickEdit(e) {
    e.preventDefault();
    this.setState({editmode: e.target.name});
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const now = new Date(Date.now()).getHours();
    const greeting = parseInt(now, 10) < 12 ? "Good Morning" : "Welcome Back";
    const { user } = this.props.auth;
    return (
      <div className="dashboard">
        <Navbar/>
        <div className="control-bar">
          <h1 className="greeting-text">{greeting}! <span>{user && user.name.first}</span></h1>
          <div className="control-btns">
            <button type="type" className="btn btn-light">
              <FontAwesomeIcon icon="comments"/>
            </button>
            <button type="type" className="btn btn-light">
              <FontAwesomeIcon icon="envelope"/>
            </button>
            <button type="type" className="btn btn-light">
              <FontAwesomeIcon icon="cog"/> 
            </button>
          </div>
        </div>
        <div className="business-info-bar">
          <h4 className="module-title">Your Business</h4>
          <div className="business-profile">
            <div className="business-info">
                <div className="sample-img">
                  <img src="/images/img-05.jpg" alt="Kool wine and sushi"/>
                </div>
                <div className="basic-info">
                  <h1 className="business-name">
                    <span className="info-label">Business name</span>
                    {this.state.editmode === "businessName" ? 
                      (<input type="text" className="info-input" onChange={(e)=>this.onChange(e)} name="businessName" value={this.state.businessName}></input>) : 
                      (<span>{this.state.businessName}</span>)
                    }
                    {this.state.editmode === "businessName" ?
                    (<span type="button" className="btn btn-primary info-save" onClick={()=>this.setState({editmode: ''})}><FontAwesomeIcon icon="check"/>Save</span>) :
                    (<FontAwesomeIcon icon="pencil-alt" className="info-edit-icon" onClick={()=>this.setState({editmode: "businessName"})}/>)}
                  </h1>
                  <h4 className="business-address">
                    <span className="info-label">Location</span>
                    {this.state.editmode === "address" ? 
                      (<input type="text" className="info-input" onChange={(e)=>this.onChange(e)} name="address" value={this.state.address}></input>) : 
                      (<span>{this.state.address}</span>)
                    }
                    {this.state.editmode === "address" ?
                    (<span type="button" className="btn btn-primary info-save" onClick={()=>this.setState({editmode: ''})}><FontAwesomeIcon icon="check"/>Save</span>) :
                    (<FontAwesomeIcon icon="pencil-alt" className="info-edit-icon" onClick={()=>this.setState({editmode: "address"})}/>)}
                  </h4>
                  <h5 className="type">
                    <span className="info-label">Establishment</span>
                    Bar and Restaurant
                    <FontAwesomeIcon icon="pencil-alt" className="info-edit-icon"/></h5>
                  <ul className="business-keywords">
                    <span className="info-label">Search keywords</span>
                    <li>Fusion Food<FontAwesomeIcon icon="times"/></li>
                    <li>Thai<FontAwesomeIcon icon="times"/></li>
                    <li>Japanese<FontAwesomeIcon icon="times"/></li>
                    <li>Bar<FontAwesomeIcon icon="times"/></li>
                    <li>Night Life<FontAwesomeIcon icon="times"/></li>
                  </ul>
                  <h5 className="create-at">
                    <span className="info-label">Online at</span>
                    Jan 01, 2019
                  </h5>
                </div>
              </div>
            <div className="stat-info">
            <span className="info-label">Your Business Stats</span>
            <div className="stat-grid">
              <div className="stat-module">
                <h6>239</h6>
                <span><FontAwesomeIcon icon="eye"/>Views</span>
              </div>
              <div className="stat-module">
                <h6>23K</h6>
                <span><FontAwesomeIcon icon="heart"/>Loved</span>
              </div>
              <div className="stat-module">
                <h6>105</h6>
                <span><FontAwesomeIcon icon="comment-alt"/>Feedbacks</span>
              </div>
              <div className="stat-module">
                <h6>60</h6>
                <span><FontAwesomeIcon icon="bookmark"/>Collected</span>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div className="board-container">
          <div className="row grid-3 for-title mt-3">
            <div className="title-card c-4 r-1">
              <h2>Your Stories</h2>
              <span style={{fontWeight: 100, fontSize: `1rem`, color: `rgb(22, 214, 102`}}>
              <FontAwesomeIcon icon="fire-alt" style={{marginRight: `8px`}}/>
              5 stories online!</span>
            </div>
          </div>
          <div className="row grid-3">
            <div className="board c-2 r-2">
              {/* <img src="/images/img-06.jpg" alt="Kool wine and sushi" className="fit-h"/> */}
              <AdsCard
                classname="square"
                imgclass="fit-width"
                src="/images/img-06.jpg"
                alt="sample"
                title="30% Discount"
                titleposition={{x: 0, y:30, align: 'center'}}
                sub={"Bar Member Only!"}
                subposition={{x: 0, y:40, align: 'center'}}
                link={"At Tatuu Bar and Tapas"}
                linkposition={{x: 0, y:50, align: 'center'}}
                font={`font-7 wh bold upper`}
              />
              <div className="story-overview">
                <h4>
                  Story Details
                  <span>
                    <FontAwesomeIcon icon="pencil-alt" className="info-edit-icon"/>
                    <FontAwesomeIcon icon="trash" className="info-edit-icon"/>
                  </span>
                </h4>
                <p className="story-info font-2">
                  <span className="info-label">Story Title</span>
                  Restaurant Discount 30%
                </p>
                <p className="story-info font-2">
                  <span className="info-label">Creator</span>
                  Dom Cobb
                </p>
                <p className="story-info font-2">
                  <span className="info-label">Template Style</span>
                  Square
                </p>
                <p className="story-info font-2">
                  <span className="info-label">Expired Date</span>
                  <span>{(new Date("30 January 2019")).toDateString()} </span>
                  <span className="sub-info-text">Expires in {(new Date("30 January 2019").getDate()) - (new Date(Date.now()).getDate())} days</span>
                </p>
                <p className="story-info font-2">
                  <span className="info-label">Status</span>
                  <button type="button" className="btn btn-warning">Published</button>
                  <span className="sub-info-text">at {new Date(Date.now()).toDateString()}</span>
                </p>
              </div>
            </div>
            <div className="board c-4 r-1">
              <h4 className="board-head pl-3 pt-3"><FontAwesomeIcon icon="fire-alt" style={{color: 'rgb(22, 214, 102)'}}/> Online Stories</h4>
              <div className="online-stories">
                <div className="story-object">
                  <div className="story-thumbnail">
                    <img src="/images/img-08.jpg" alt="story-id" className="fit-h"/>
                  </div>
                  <div className="story-brief font-2">
                    <h6>Meet Chef Ander</h6>
                    <p>2 days ago by Tatuu</p>
                  </div>
                </div>
                <div className="story-object selected">
                  <div className="story-thumbnail">
                    <img src="/images/img-06.jpg" alt="story-id" className="fit-h"/>
                  </div>
                  <div className="story-brief font-2">
                    <h6>Restaurant Discount 30%</h6>
                    <p>1 days ago by Dom</p>
                  </div>
                </div>
                <div className="story-object">
                  <div className="story-thumbnail">
                    <img src="/images/img-03.jpg" alt="story-id" className="fit-h"/>
                  </div>
                  <div className="story-brief font-2">
                    <h6>Dim Sum All You Can Eat</h6>
                    <p>6h ago</p>
                  </div>
                </div>
                <div className="story-object">
                  <div className="story-thumbnail">
                    <img src="/images/img-09.jpg" alt="story-id" className="fit-h"/>
                  </div>
                  <div className="story-brief font-2">
                    <h6>English Afternoon in SF</h6>
                    <p>23m ago</p>
                  </div>
                </div>
                <div className="story-object">
                  <div className="story-thumbnail">
                    <img src="/images/img-05.jpg" alt="story-id" className="fit-h"/>
                  </div>
                  <div className="story-brief font-2">
                    <h6>Party 10+ Get Discount</h6>
                    <p>1m ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="board c-4 r-1">
              <h4 className="board-head pl-3 pt-3"><FontAwesomeIcon icon="edit" style={{color: 'rgb(22, 214, 102)'}}/> Create Story</h4>
            </div>
            <div className="board c-2 r-2 p-3">
              <h4 className="board-head">Admins</h4>
              <ul className="admin-list">
                <li>
                  <div className="admin-thumbnail">
                    <div className="col-left">
                    </div>
                    <div className="col-right">
                      <p className="admin-name">Thanaphon Chaysawat</p>
                      <p className="admin-title">Owner and Manager</p>
                      <div className="edit-btn">
                        <FontAwesomeIcon icon="pencil-alt" className="edit-icon pencil"/>
                        <FontAwesomeIcon icon="times" className="edit-icon delete"/>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="admin-thumbnail">
                    <div className="col-left">
                    </div>
                    <div className="col-right">
                      <p className="admin-name">Dom Cobb</p>
                      <p className="admin-title">Head Chef</p>
                      <div className="edit-btn">
                        <FontAwesomeIcon icon="pencil-alt" className="edit-icon pencil"/>
                        <FontAwesomeIcon icon="times" className="edit-icon delete"/>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="row grid-3">
            <div className="board g-6">Yes</div>
            <div className="board g-3">Ok</div>
            <div className="board g-3">Ok</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect( mapStateToProps , {} )(Dashboard);