import React from 'react'
import PropTypes from 'prop-types'
import './InputFieldGroup.css'

const InputFieldGroup = ({
  name,
  label,
  divclassname,
  classname,
  placeholder,
  value,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className={divclassname ? `input-control ${divclassname}`:"input-control"}>
      { label && <label className="input-label">{label}</label>}
      <input 
        type={type} 
        className={classname}
        value={value}
        placeholder={placeholder} 
        name={name} 
        onChange={onChange}
        disabled={disabled}
      />
      {info && <small className="info-text">{info}</small>}
      { error && <small>{ error }</small>}
    </div>
  )
}

InputFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  info: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string

}

export default InputFieldGroup
