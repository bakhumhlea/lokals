import React from 'react';
// import classnames from 'classnames';
import PropTypes from 'prop-types';
import './TextFieldGroup.css';

const TextFieldGroup = ({
  name,
  label,
  labelclassname,
  divclass,
  classname,
  placeholder,
  value,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  const divClass = divclass ? `form-group ${divclass}` : "form-group";
  return (
    <div className={divClass}>
      {label && <label className={labelclassname}>{label}</label>}
      <input 
        type={type} 
        className={classname}
        value={value}
        placeholder={placeholder} 
        name={name} 
        onChange={onChange}
        disabled={disabled}
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback" style={error? {display: "block"}:{display: "none"}}>{error}</div>}
    </div>
  )
}

TextFieldGroup.proptypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  info: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
}

TextFieldGroup.defaultProps = {
  type: 'text'
}

export default TextFieldGroup;
