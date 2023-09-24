import React from 'react'

export const MAX_FILE_SIZE = 102400;
export const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };
export const phoneRegex = RegExp(
    /^[\+]?[(]?[0-9]{0,2}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{2,3}[-\s\.]?[0-9]{2,4}[-\s\.]?[0-9]{0,2}$/
)

export const isValidFileType = (fileName, fileType) => {
    return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

export const getAllowedExt = (type) => {
    return validFileExtensions[type].map((e) => `.${e}`).toString()
}

export const ErrorMessageWrapper = (msg) => {
  return (
      <div className="form__error">
          {msg}
      </div>
  )
}

export const ApiErrorMessage = ({message}) => {
  return (
      <div className="form__error form__error--api">
        {message}
      </div>
  )
}
