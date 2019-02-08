import React, { Component } from 'react'
// import Navbar from '../Navbar';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrinStars, faCheckCircle, faDollarSign, faStar, faClipboardList, faWifi, faUtensils } from '@fortawesome/free-solid-svg-icons';

import './BusinessProfilePage.css';
// import Map from '../Map';
import Axios from 'axios';
// import { getOpeningStatus } from '../../util/getOpeningStatus';
import ListCard from './ListCard';
import SuggestionCard from './SuggestionCard';
import BusinessPageHeader from './BusinessPageHeader';
import BusinessInfo from './BusinessInfo';
// import markerOne from '../../images/Markers/Marker_01.svg';
// import { GOOGLE_MAP_API } from '../../config/keys';
import StoryCard from './StoryCard';
library.add( faGrinStars, faCheckCircle, faDollarSign, faStar, faClipboardList, faWifi, faUtensils )

// const SF = {lat: 37.7749, lng: -122.4194};

function imgMove() {
  var img = document.getElementById("header-img");
  var offsetFromTop = window.scrollY;
  if (img) {
    img.style.transform = `translateY(${(50 - (offsetFromTop/10))*(-1)}%)`;
  }
}
window.onscroll = imgMove;

class BusinessProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessName: 'West Coast Wine • Cheese',
      businessType: 'Wine Bar',
      recommended: 539,
      price: 2,
      keywords: ['wine','cheese & charcuterie','food','beer'],
      address: '',
      opennow: false,
      openingHours: [],
      official: true,
      stories: [],
      events: [],
      featureOn: [],
      photos: [],
      mapMarker: [],
      showmoreIds: [],
    }
  }
  componentDidMount() {
    this.getBusinessData();
  }
  componentWillUnmount() {
    window.onscroll = null;
  }
  getBusinessData() {
    const businessId = '5c1de46de2891edfab420a7b';
    Axios.get(`/api/business/profile/id/${businessId}`)
      .then(res => {
        console.log(res.data);
        this.setState({mapMarker: [res.data]});
      })
      .catch(err => {
        console.log(err.response.data);
      })
  }
  onExpend(storyId) {
    var { showmoreIds } = this.state;
    if (showmoreIds.includes(storyId)) {
      showmoreIds.splice(showmoreIds.indexOf(storyId),1);
    } else {
      showmoreIds.push(storyId);
    }
    this.setState({ showmoreIds: showmoreIds });
  }
  consoleData(e) {
    e.preventDefault();
    console.log(this.state.mapMarker);
  }
  render() {
    const { official, price, recommended, mapMarker } = this.state;
    return (
      <div className="businesss-profile-page font-6">
        {mapMarker[0] && (<BusinessPageHeader
          businessdata={mapMarker[0]}
          official={official}
          price={price}
          recommended={recommended}
        />)}
        <div className="page-body">
          <div className="content-grid">
            <div className="feedback-banner c-2">
              <div className="feedback-card">
                <FontAwesomeIcon icon="comment" className="emoji-icon"/>
                <h2 className="question-text">
                  Have you visited <strong>{mapMarker[0] && mapMarker[0].business_name}</strong>?</h2>
                <div className="answer-btn-control">
                  <button 
                    className="cm-btn positive">
                    Yes, I have!
                    {/* <FontAwesomeIcon icon="grin-stars" className="emoji-icon"/> */}
                  </button>
                  <button 
                    className="cm-btn negative">
                    Nope!
                    {/* <FontAwesomeIcon icon="smile" className="emoji-icon"/> */}
                  </button>
                </div>
              </div>
            </div>
            <div className="c-1 r-1 content-main">
              <h1 className="content-topic font-4">
                <FontAwesomeIcon icon="star" className="topic-icon"/>
                Highlight
              </h1>
              <div className="content-main-grid-2">
                <StoryCard
                  coverImg={"/images/img-13.jpg"}
                  type={"News"}
                  head={"Meet our new barista! Leon Nguyen"}
                  content={"We are proud to introduce Mr Leon Nguyen as our new head Barista at West Coast Coffee and Bread. Leon, who recently won a The Most Awesome Pouring Milk on Latte Award from Latte Academy last December, bring a new fresh coffee menu deliver to our guest from now on."}
                  postowner={{url: '/images/Profile_Pictures/profile-03.jpg', name: 'Lisa Aoi', title: 'Admin'}}
                  onExpend={(id)=>this.onExpend(id)}
                  showmoreIds={this.state.showmoreIds}
                  storyId={'ABC123'}
                />
                <StoryCard
                  gridSpan={'c-1'}
                  coverImg={"/images/img-15.jpg"}
                  type={"News"}
                  head={`New Wine by The Glass: Unti's Montepulciano 2013`}
                  content={"We are proud to introduce Mr Leon Nguyen as our new head Barista at West Coast Coffee and Bread. Leon, who recently won a The Most Awesome Pouring Milk on Latte Award from Latte Academy last December, bring a new fresh coffee menu deliver to our guest from now on."}
                  postowner={{url: '/images/Profile_Pictures/profile-01.jpg', name: 'Jill Contraband', title: 'Owner'}}
                  onExpend={(id)=>this.onExpend(id)}
                  showmoreIds={this.state.showmoreIds}
                  storyId={'DEF456'}
                />
                <StoryCard
                  gridSpan={'c-1'}
                  coverImg={"/images/img-14.jpg"}
                  type={"News"}
                  head={`New Wine by The Glass: Unti's Montepulciano 2013`}
                  content={"We are proud to introduce Mr Leon Nguyen as our new head Barista at West Coast Coffee and Bread. Leon, who recently won a The Most Awesome Pouring Milk on Latte Award from Latte Academy last December, bring a new fresh coffee menu deliver to our guest from now on."}
                  postowner={{url: '/images/Profile_Pictures/profile-02.jpg', name: 'Romelu Osas', title: 'Head Chef'}}
                  onExpend={(id)=>this.onExpend(id)}
                  showmoreIds={this.state.showmoreIds}
                  storyId={'GHI789'}
                />
                <div className="hightlight-card" style={{backgroundImage: `url('/images/img-03.jpg')`}}>
                  <div className="content-text">
                    <h1 className="story-title font-5">Farfalle and Pesto</h1>
                    <h4 className="story-subtitle font-4">By Chef Paul Chaysawat</h4>
                    <p className="story-desc font-4">Enjoy a nice bottle of our Hourglass's Savignon Blanc alongside with an awesome Farfalle and Pesto, perfectly crafted by Chef Paul, now at West Coast Wine • Cheese</p>
                  </div>
                </div>
              </div>
              {/* <h1 className="content-topic font-4">
                <FontAwesomeIcon icon="comment" className="topic-icon"/>
                Give some feedbacks
              </h1> */}
              {/* <div className="content-main">
                <div className="feedback-card">
                  <h2 className="question-text">
                    Would you recommend <strong>{mapMarker[0] && mapMarker[0].business_name}</strong> to your friend?</h2>
                  <div className="answer-btn-control">
                    <button 
                      className="cm-btn positive">
                      Definitely!
                      <FontAwesomeIcon icon="grin-stars" className="emoji-icon"/>
                    </button>
                    <button 
                      className="cm-btn negative">
                      No, Thanks
                      <FontAwesomeIcon icon="smile" className="emoji-icon"/>
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="c-1 r-1">
              <h1 className="content-topic font-4">
                <FontAwesomeIcon icon="info" className="topic-icon bg-2"/>
                Business Info
              </h1>
              { mapMarker[0] && (
                <BusinessInfo
                  marker={mapMarker}
                  businessdata={mapMarker[0]}
                />
              )}
              <h1 className="infobox-title font-4">
                <FontAwesomeIcon icon="utensils" className="topic-icon"/>
                On Eat Lists
              </h1>
              <div className="content col-right dp-grid rgap-1">
                <ListCard
                  imgSrc={"/images/img-06.jpg"}
                  title={"Wine Night Life"}
                  desc={"Beautiful night and a glass of tasty wine would be awesome right? We picked the top wine bars in SF for you here."}
                  followers={459}
                  uid="userid"
                  creator={"Lokals Team SF"}
                />
                <ListCard
                  imgSrc={"/images/img-05.jpg"}
                  title={"Beautiful\n\rRestaurant & Bar"}
                  desc={`Nice Decoration, Great Design and of course, Delicious Food and Drink! We gether top of them in this list.`}
                  followers={121}
                  uid="userid"
                  creator={"Anthony"}
                  byUser={true}
                />
              </div>
            </div>
            <div className="c-2 r-1 suggestions">
              <h1 className="infobox-title font-4 mt-0">
                <FontAwesomeIcon icon="grin-stars" className="topic-icon"/>
                You may like
              </h1>
              <div className="suggestions-list">
                <SuggestionCard
                  imgSrc="/images/img-11.jpg"
                  baseOnSearch={"Coffee"}
                  similarTo={"West Coast Wine"}
                  name={"Ander Cafe"}
                  icon="coffee"
                  type={"Coffee & Breakfast"}
                  rating={95}
                  address={"23 Divisadero Ave, San Francisco"}
                  uid={""}
                />
                <SuggestionCard
                  imgSrc="/images/img-12.jpg"
                  baseOnSearch={"Japanese"}
                  similarTo={"Marufuku"}
                  name={"Shinji's Omakase"}
                  icon="utensils"
                  type={"Restaurant"}
                  rating={82}
                  address={"2892 Post st. Japanese Town"}
                  uid={""}
                />
                <SuggestionCard
                  imgSrc="/images/img-14.jpg"
                  baseOnSearch={"Fine Dining"}
                  similarTo={"West Coast Wine"}
                  name={"The Stretford End"}
                  icon="glass-martini-alt"
                  type={"Bar & Restaurant"}
                  rating={95}
                  address={"49 Spears st. Financial Distric"}
                  uid={""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BusinessProfilePage;