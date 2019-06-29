import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSpinner, faCloudRain, faBolt, faFireAlt, faGrinHearts, faGrinStars } from '@fortawesome/free-solid-svg-icons'

import PrivateRoute from './components/reusable/PrivateRoute';
import Navbar from './components/Navbar';
// import Landing from './components/Landing';
import BusinessSearch from './components/BusinessSearch';
import Register from './components/Register';

import './App.css';
import Login from './components/Login';
// import Explore from './components/Explore';
// import Feed from './components/Feed';
import ClaimBusiness from './components/ClaimBusiness';
import Dashboard from './components/Dashboard';
import BusinessProfilePage from './components/BusinessProfilePage/BusinessProfilePage';
import LokalsMain from './components/LokalsMain/LokalsMain';
// import LokalsSearchMap from './components/LokalsSearchMap/LokalsSearchMap';
import BusinessRoute from './components/reusable/BusinessRoute';
import { fetchToken } from './util/fetchToken';
import SystemDesign from './components/SystemDesign';
import ExploreMap from './components/ExploreMap/ExploreMap';
import BOHLogin from './components/LokalsBOH/BOHLogin';
import BOHBusinesses from './components/LokalsBOH/BOHBusinesses';

library.add(faSpinner, faFireAlt, faGrinHearts, faGrinStars, faCloudRain, faBolt, faFireAlt, fab);

fetchToken();

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <Navbar/>
            <div className="container">
              <Route exact path="/" component={LokalsMain}/>
              <Route exact path="/explore" component={ExploreMap}/>
              <Route exact path="/signup" component={Register}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/biz/sample-business" component={BusinessProfilePage}/>
              <Route exact path="/lokalsforbusiness" component={BusinessSearch} />
              <Route exact path="/lokalsbiz/login" component={Login}/>
              <Route exact path="/system-design" component={SystemDesign}/>
              <Route exact path="/lokals-boh" component={BOHLogin}/>
              <Route exact path="/lokals-boh/add-businesses" component={BOHBusinesses}/>
              <Switch>
                <PrivateRoute exact path="/claimyourbusiness/edit-profile" component={ClaimBusiness}/>
              </Switch>
              <Switch>
                <BusinessRoute exact path="/lokalsbiz/dashboard" component={Dashboard}/>
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
