import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ToggleBtn = ({
  ontoggle,
  mode,
  button1,
  button2
}) => {
  return (
    <div>
      {!mode ? (<span className="btn edit" onClick={()=>ontoggle()}>
          {/* <FontAwesomeIcon icon="pencil-alt" className="edit-icon"/> */}
          {button1 && button1}
        </span>):
        (<span className="btn edit save" onClick={()=>ontoggle()}>
          {/* <FontAwesomeIcon icon="check" className="edit-icon"/> */}
          {button2 && button2}
        </span>)}
    </div>
  )
}
export default ToggleBtn