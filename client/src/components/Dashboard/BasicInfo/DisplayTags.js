import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DisplayTags.css';
import { capitalize } from '../../../util/stringFormat';


class DisplayTags extends Component {
  state = {
    value: 'american'
  }
  onSubmit(e) {
    e.preventDefault();
    const { value } = this.state;
    this.props.onclickadd(e, value);
  }
  onChange(e) {
    e.preventDefault();
    this.setState({value:e.target.value});
  }
  onRemove(data) {
    this.props.onclickremove(data)
  }
  render() {
    const {
      name,
      data,
      objkey,
      editmode,
      sectionclass,
      containerclass,
      labelcomp,
      selectoptions
    } = this.props;
    const { value } = this.state;
    return (
      <div className="display-tags">
      {labelcomp && labelcomp}
      <div className={sectionclass?sectionclass:`default-tags-section`}>
        <div className={containerclass?`${containerclass} default-container`:`default-container`}>
          {data.map((el,i) => (
            <span className={editmode?`default-tag editmode`:`default-tag`} key={i}>
              {el[objkey]}
              {editmode && <FontAwesomeIcon 
                icon="times" 
                className="close-icon"
                name={name}
                onClick={()=>this.onRemove(el[objkey])}
              />}
            </span>
          ))}
        </div>
        {editmode && 
          <form onSubmit={(e)=>this.onSubmit(e)} name={name}>
          <div className={containerclass?`${containerclass} default-form`:`default-form`}>
            <div className="default-select">
              <select 
                name={name}
                type="text"
                value={value}
                onChange={(e)=>this.onChange(e)}
              >
                {selectoptions.map((opt,i) => (
                  <option value={opt} key={i}>{capitalize(opt)}</option>))
                }
              </select>
            </div>
            <button className="btn btn-dark btn-add" type="submit">Add</button>
          </div>
          </form>}
      </div>
    </div>
    )
  }
}
export default DisplayTags;