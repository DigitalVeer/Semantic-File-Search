import React from 'react'
import './form-input.scss'

const FormField = ({ id, label, placeholder, type, ...inputProps }) => {
  return (
    <div className='input__group'>
      <label htmlFor={id} className='input__label'>
        {label}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        className='input__field input__field--normal'
        spellCheck='false'
        autoComplete='off'
        // onInvalid={(e) => e.preventDefault()}
        type={type}
        required
        {...inputProps}
      ></input>
    </div>
  )
}

export default FormField
