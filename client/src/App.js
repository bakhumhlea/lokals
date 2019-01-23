import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import setAuthToken from './util/setAuthToken';
import jwt_decode from 'jwt-decode'
import { setCurrentUser } from './actions/authActions';

import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSpinner, faCloudRain, faBolt, faFireAlt, faGrinHearts, faGrinStars } from '@fortawesome/free-solid-svg-icons'

import PrivateRoute from './components/reusable/PrivateRoute';
// import Navbar from './components/Navbar';
// import Landing from './components/Landing';
import BusinessSearch from './components/BusinessSearch';
import Register from './components/Register';

import './App.css';
import Login from './components/Login';
import Explore from './components/Explore';
import Feed from './components/Feed';
import ClaimBusiness from './components/ClaimBusiness';
import Dashboard from './components/Dashboard';

library.add(faSpinner, faFireAlt, faGrinHearts, faGrinStars, faCloudRain, faBolt, faFireAlt, fab);

const token = localStorage.getItem('jwtToken');

if (token) {
  const decoded = jwt_decode(token);
  const currentTime = Date.now() / 1000;
  setAuthToken(token);
  localStorage.setItem('jwtToken', token);
  store.dispatch(setCurrentUser(decoded));

  if(decoded.exp < currentTime) {
    store.dispatch(setCurrentUser({}));
    localStorage.removeItem('jwtToken');
    setAuthToken();
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <div className="container">
              <Route exact path="/" component={Explore}/>
              <Route exact path="/explore" component={Feed}/>
              <Route exact path="/signup" component={Register}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/lokalsforbusiness" component={BusinessSearch} />
              <Switch>
                <PrivateRoute exact path="/claimyourbusiness/edit-profile" component={ClaimBusiness}/>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/lokalsbiz/dashboard" component={Dashboard}/>
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
