import * as React from "react"
import {Field, Form, Formik} from "formik"
import {BookedConsultationsFilterType} from "../../redux/bookedConsultations/bookedConsultations-reducer"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"
import {FormSelect} from "./FormSelect"
import {SelectOptionType} from "../../types/Types"

const handleChange = () => {
  console.log("HandleChange!!!")
}

type FormType = {
  term: string
  condition: string
}

type PropsType = {
  options: Array<SelectOptionType>
  filter: BookedConsultationsFilterType
  onFilterChanged: (filter: BookedConsultationsFilterType) => void
}

export const SearchFilterForm: React.FC<PropsType> = React.memo(({
  options,
  filter,
  onFilterChanged
}) => {
  const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const filter: BookedConsultationsFilterType = {
      term: values.term,
      condition: values.condition
    }
    onFilterChanged(filter)
    setSubmitting(false)
  }
  const initialValues = {
    term: filter.term,
    condition: filter.condition
  }
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={submit}
    >
      {
        (propsF) => {
          let {isSubmitting} = propsF
          return (
            <Form
              className={"form search-form"}
            >
              <Field
                className={"search-input"}
                type="text"
                name="term"
                placeholder={"Search..."}
              />
              <FormSelect
                  name="condition"
                  options={options}
                  handleChange={handleChange}
                  placeholder={'All'}
              />
              <button
                className={"btn btn--sm btn--light-bg search-submit"}
                type="submit" disabled={isSubmitting}
              >
                <svg><use href={`${Sprite}#search`}/></svg>
              </button>
            </Form>
          )
        }
      }
    </Formik>
  )
})
