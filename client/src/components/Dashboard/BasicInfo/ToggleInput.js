import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class EditRea extends Component {
  render() {
    const { data, datakey, classname, editmode, ontoggle, onchange } = this.props;
    return (
      <div className="toggle-input">
        <p className="basic-info-label">
          <FontAwesomeIcon icon="clipboard-list" className="label-icon"/>Reservation</p>
        <div className={classname ? `switch-input-field ${classname}` : "switch-input-field"}>
          <div className="basic-info">
          {!editmode ?
            (<div className="reservation-form">
              <span className="default-tag">{data[datakey[0]]?"Yes":"No"}</span>
              <span className="note">{data[datakey[1]]}</span>
            </div>)
            :
            (<div className="reservation-form">
              <span className={data[datakey[0]]?`btn-toggle`:`btn-toggle no`} onClick={(e)=>ontoggle(data[datakey[0]])}>{data[datakey[0]]?"Yes":"No"}</span>
              {data[datakey[0]] && <textarea 
                className="default-input"
                type="text"
                name="reservation" value={data[datakey[1]]} 
                onChange={(e)=>onchange(e,datakey[1])} 
                placeholder={`Add ${datakey[1]}`}/>}
            </div>)
          }
          </div>
        </div>
      </div>
    )
  }
}
