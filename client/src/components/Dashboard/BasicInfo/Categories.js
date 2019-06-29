import React, { Component } from 'react'
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleBtn from '../../reusable/ToggleBtn';
import { updateBusinessProfile } from '../../../actions/businessAction';
import { capitalize } from '../../../util/stringFormat';
import './CommonStyle.css';

class Categories extends Component {
  state={
    value: '',
    editmode: null,
  }
  onClickEditSave(sectionname) {
    const { data } = this.props;
    const { editmode } = this.state;
    if (editmode !== sectionname) {
      this.setState({ editmode: sectionname })
    } else {
      this.props.updateBusinessProfile(data);
      this.setState({ editmode: null })
    }
  }
  onChange(e) {
    e.preventDefault();
    this.setState({value:e.target.value});
  }
  render() {
    const { data, name, objkey, selectoptions, tagclass, onclickadd, onclickremove} = this.props;
    const { editmode, value } = this.state;
    console.log(value);
    return (
      <div className="dashboard-section">
        <div className="board-header">
          <h2 className="board-title">Tags</h2>
          <ToggleBtn
            mode={editmode==='cate'}
            ontoggle={()=>this.onClickEditSave('cate')}
            button1={(<span><FontAwesomeIcon icon="edit" /> Edit</span>)}
            button2={(<span><FontAwesomeIcon icon="save" /> Save</span>)}
          />
        </div>
        <div className="float-card categories-board single-part pr-4 pl-4">
          <div className="display-tags">
            {data.categories.map((el,i) => (
              <span className={editmode?`${tagclass} editmode`:`${tagclass}`} key={i}>
                {el[objkey].split('_').map(el=>capitalize(el)).join(' ')}
                {editmode && <FontAwesomeIcon 
                  icon="times" 
                  className="close-icon"
                  name={name}
                  onClick={()=>onclickremove(el[objkey])}
                />}
              </span>
            ))}
        </div>
        {editmode && 
        <form onSubmit={(e)=>onclickadd(e,value)} name={name}>
          <div className="default-form">
            <div className="default-select">
              <select 
                name={name}
                type="text"
                value={value}
                onChange={(e)=>this.onChange(e)}
              >
                {selectoptions.map((opt,i) => (
                  <option 
                    value={opt} 
                    key={i}>
                    {opt.split('_').map(el=>capitalize(el)).join(' ')}
                  </option>))
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

export default connect(null, { updateBusinessProfile })(Categories)