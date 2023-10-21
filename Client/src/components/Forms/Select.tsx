import * as React from 'react'
import {Field } from 'formik'
import {FieldWrapper} from './FieldWrapper'

const options = [
  { value: "mail", label: "email" },
  { value: "phone", label: "phone" },
  { value: "whatsapp", label: "whatsapp" },
  { value: "messenger", label: "messenger" },
  { value: "insta", label: "inst" }
]

export const Select = (props) => {

  const {label, name, options, ...rest} = props

  return (
      <FieldWrapper name={name}>
        <Field as={"select"} name={name} {...rest} />
      </FieldWrapper>
  )
}
