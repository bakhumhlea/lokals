import React, { Component } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { getOpeningStatus } from '../util/getOpeningStatus';

library.add( faTimes );

const INITIAL_STATE = {
  text: "",
  status: true,
}
class OpenTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    }
    this.timer = null;
  }
  componentDidMount() {
    this.setState({ 
      text: getOpeningStatus(this.props.hours).text, 
      status: getOpeningStatus(this.props.hours).status,
    });
    this.timer = setInterval(() => {
      const { text, status } = getOpeningStatus(this.props.hours);
      this.setState({ text: text, status: status });
    }, 10000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  stoptimer(e) {
    e.preventDefault();
    clearInterval(this.timer);
  }
  render() {
    const classname = this.state.status ? "opening-hours opened" : "opening-hours";
    return (
      <div>
        <p className={classname} style={this.props.styled && this.props.styled}>
          {this.props.icon && <span><FontAwesomeIcon icon="clock" className="time-icon"/></span>}
          {this.state.text}
        </p>
      </div>
    )
  }
}

export default OpenTime;