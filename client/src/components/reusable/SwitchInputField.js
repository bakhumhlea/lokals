import React from 'react'
import isEmpty from '../../util/is-empty'
import { capitalize } from '../../util/stringFormat';

const SwitchInputField = ({
  labelcomp,
  name,
  editmode,
  data,
  onchange,
  focus,
  classname,
  textarea
}) => {
  const inputComponent = textarea ? 
    (<textarea className="basic-info editmode"
      maxLength={500}
      type="text"
      name={name} value={data} 
      onChange={(e)=>onchange(e)} 
      autoFocus={focus}
      placeholder={name.split('_').map(w => capitalize(w)).join(' ')} />) :
    (<input 
      className="basic-info editmode"
      type="text"
      name={name} value={data} 
      onChange={(e)=>onchange(e)} 
      autoFocus={focus}
      placeholder={name.split('_').map(w => capitalize(w)).join(' ')}/>
    );
  return (
    <div>
      {labelcomp && labelcomp}
      <div className={classname ? `switch-input-field ${classname}` : "switch-input-field"}>{!editmode ?
        (<p className="basic-info">
          {!isEmpty(data)?data:(<span className="no-info">No info</span>)}
        </p>)
        :
        inputComponent}
      </div>
    </div>
  )
}
export default SwitchInputField;