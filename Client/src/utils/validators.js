import React from 'react'
export const required = value => {
  if (value) return undefined
  return 'Field is required'
}

export const maxLengthCreator = (maxLength) => (value) => {
  if (value.length > maxLength) return `Max length is ${maxLength} symbols`

  return undefined
}

export const minLengthCreator = (minLength) => (value) => {
  if (value.length < minLength) return `Min length is ${minLength} symbols`

  return undefined
}

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)

export const validateEmailField = values => {

  const errors = {}
  if (!values.email) {
    errors.email = 'Required 1'
  } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test( values.email )
  ) {
    errors.email = 'Invalid email address'
  }
  return errors

}

export const ErrorMessageWrapper = (msg) => {
  return (
      <div className="form__error">
          {msg}
      </div>
  )
}
