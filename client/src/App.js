import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSpinner, faCloudRain, faBolt, faFireAlt, faGrinHearts, faGrinStars } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import BusinessSearch from './components/BusinessSearch';
import Register from './components/Register';

library.add(faSpinner, faFireAlt, faGrinHearts, faGrinStars, faCloudRain, faBolt, faFireAlt, fab);

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <Navbar/>  
            <div className="container">
              <Route exact path="/" component={Landing}/>
              <Route exact path="/sign-up" component={Register}/>
              <Route exact path="/lokalsforbusiness" component={BusinessSearch} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
