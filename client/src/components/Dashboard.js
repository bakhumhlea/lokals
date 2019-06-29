import React, { Component } from 'react'
import { connect } from 'react-redux'

import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faPencilAlt, faEdit, faCog, faEnvelope, faComments, faEye, faCommentAlt, faHeart, faCheck, faChevronCircleLeft, faChevronCircleRight, faTrash, faTrashAlt, faPlus, faTimesCircle, faArrowsAltH, faArrowsAltV, faAlignLeft, faAlignCenter, faAlignRight } from '@fortawesome/free-solid-svg-icons'

import './Dashboard.css'
// import AdsCard from './AdsCard';
// import StoryThumbnail from './StoryThumbnail';
// import CreateStory from './CreateStory';
import Axios from 'axios';
import BasicInfo from './Dashboard/BasicInfo/BasicInfo';
import Categories from './Dashboard/BasicInfo/Categories';

library.add(faPencilAlt, faEdit, faCog, faEnvelope, faComments, faEye, faCommentAlt, faHeart, faCheck, faChevronCircleLeft, faChevronCircleRight, faTrash, faTrashAlt, faPlus, faTimesCircle, faArrowsAltH, faArrowsAltV, faAlignLeft, faAlignCenter, faAlignRight, fab);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      business_data: {
        additional_info: [],
        address: {},
        approved: null,
        business_name: '',
        business_type: '',
        categories: [],
        create_at: '',
        cuisines: [],
        dining_style: '',
        events: [],
        formatted_address: '',
        feature_in: [],
        google_place_id: '',
        images: [],
        location: {},
        messages: [],
        opening_hours: [],
        payment_options: [],
        recommended: [],
        reservation: {},
        stories: [],
        talk_about: [],
        _id: ''
      },
      editmode: '',
      selectedStory: 0,
    }
  }
  componentDidMount() {
    const { auth } = this.props;
    const { business_data } = this.state;
    if (!auth.isAdmin) {
      return this.props.history.push('/unauthorized-access');
    } else {
      Axios.get('/api/business/profile')
        .then(res => {
          console.log(res.data);
          return this.setState(
            { business_data: {
              ...business_data,
              ...res.data,
              reservation: {
                available: res.data.reservation.available,
                note: res.data.reservation.note?res.data.reservation.note:''
              }
            } }
          )
        })
        .catch(err => console.log(err.response));
    }
  }
  onClickEdit(e) {
    e.preventDefault();
    this.setState({editmode: e.target.name});
  }
  onChange(e, key) {
    e.preventDefault();
    if (key) {
      this.setState({ 
        business_data: { 
          ...this.state.business_data, 
          [e.target.name]: {
            ...this.state.business_data[e.target.name],
            [key]: e.target.value 
          }
        } 
      });
    } else {
      this.setState({ 
        business_data: { 
          ...this.state.business_data, 
          [e.target.name]: e.target.value 
        } 
      });
    }
  }
  onAddToArray(e,data,objkey) {
    e.preventDefault();
    const arrayData = this.state.business_data[e.target.name];
    if (objkey) {
      if (!arrayData.map(el=>el[objkey]).includes(data)) {
        this.setState({ 
          business_data: { 
            ...this.state.business_data, 
            [e.target.name]: arrayData.concat({[objkey]: data})
          } 
        });
      }
    } else {
      if (!arrayData.includes(data)) {
        this.setState({ 
          business_data: { 
            ...this.state.business_data, 
            [e.target.name]: arrayData.concat(data)
          } 
        });
      }
    }
  }
  onRemoveFromArray(name,data,objkey) {
    if (objkey) {
      var arrayData = this.state.business_data[name];
      if (arrayData.map(el=>el[objkey]).includes(data)) {
        const removeIndex = arrayData.map(el=>el[objkey]).indexOf(data)
        arrayData.splice(removeIndex,1);
        this.setState({ 
          business_data: { 
            ...this.state.business_data, 
            [name]: arrayData
          } 
        });
      }
    } 
  }
  onToggleValue(value, name, objkey) {
    if (objkey) {
      this.setState({ 
        business_data: { 
          ...this.state.business_data, 
          [name]: {
            ...this.state.business_data[name],
            [objkey]: !value
          }
        } 
      });
    }
  }
  render() {
    // const now = new Date(Date.now()).getHours();
    // const greeting = parseInt(now, 10) < 12 ? "Good Morning" : "Welcome";
    // const { user } = this.props.auth;
    const { business_data } = this.state;
    console.log(business_data);
    return (
      <div className="business-dashboard">
        {/* <h1 className="greeting-text">Dashboard</h1> */}
        <div className="container-grid c-3-fr c-gap-4 r-gap-4 board-container">
          <div className="col-l c-2">
            <div className="dashboard-section">
              <div className="float-card greeting-board">Good Morning!</div>
            </div>
            <div className="dashboard-section">
              <div className="board-header">
                <h2 className="board-title">Audience Overview</h2>
              </div>
              <div className="overview-board" style={{display: 'flex',justifyContent:'space-between'}}>
                <div className="float-card" style={{width: '23%',height: '200px'}}>
                  View
                </div>
                <div className="float-card" style={{width: '23%',height: '200px'}}>
                  Like
                </div>
                <div className="float-card" style={{width: '23%',height: '200px'}}>
                  Interact
                </div>
                <div className="float-card" style={{width: '23%',height: '200px'}}>
                  Share
                </div>
              </div>
            </div>
            <div className="dashboard-section">
              <div className="board-header">
                <h2 className="board-title">Stories</h2>
              </div>
              <div className="float-card stories-board">A lot of stories here</div>
            </div>
            <div className="dashboard-section">
              <div className="board-header">
                <h2 className="board-title">Happy Hours</h2>
              </div>
              <div className="float-card stories-board">
                <h6>Do you have a happy time for your guest?</h6>
                <p>This will help improve user viewing rate</p>
              </div>
            </div>
          </div>
          <div className="col-r c-1">
            <BasicInfo
              data={business_data}
              onchange={(e,key) => this.onChange(e,key)}
              onAddToArray={(e,data, objkey) => this.onAddToArray(e,data, objkey)}
              onRemoveFromArray={(name,data,objkey) => this.onRemoveFromArray(name,data,objkey)}
              onToggleValue={(value, name, objkey) => this.onToggleValue(value, name, objkey)}
            />
            <Categories
              name="categories" 
              data={business_data}
              objkey={'keyword'}
              sectionclass="switch-input-field common"
              tagclass="category-tag"
              onclickadd={(e,data)=>this.onAddToArray(e,data,'keyword')}
              onclickremove={(data)=>this.onRemoveFromArray('categories',data,'keyword')}
              selectoptions={['fine_dining','spacial_occasions','quick_meal','good_for_a_date','unique_experience','romantic','late_night','girl_night_out','cozy_and_chill']}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

export default connect( mapStateToProps , {} )(Dashboard);