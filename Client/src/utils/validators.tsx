import * as React from "react"

export const MAX_FILE_SIZE = 1024 * 1024
export const VALID_FILE_EXTENSIONS = ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp']

export const phoneRegex = RegExp(
    /^[+]?[(]?[0-9]{0,2}[)]?[-\s.]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{2,3}[-\s.]?[0-9]{2,4}[-\s.]?[0-9]{0,2}$/
)

export const isFileSizeValid = (files: Array<File>, maxSize: number): boolean => {
    let valid = true
    if (files) {
        files.map(file => {
            const fileSize = file.size
            if (fileSize > maxSize) {
                valid = false
            }
        })
    }
    return valid
}

export function isFileTypesValid(files: Array<File>, authorizedExtensions: Array<string>): boolean {
    let valid = true
    if (files) {
        files.map(file => {
            if (!authorizedExtensions.includes(file.type)) {
                valid = false
            }
        })
    }
    return valid
}

export const ErrorMessageWrapper = (msg: any) => {
  return (
      <div className="form__error">
          {msg}
      </div>
  )
}

export const ApiErrorMessage = (message: any) => {
  return (
      <div className="form__error form__error--api">
        {message}
      </div>
  )
}
