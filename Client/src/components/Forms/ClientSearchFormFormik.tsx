import * as React from 'react'
import {Field, Form, Formik} from 'formik'
import {ClientsFilterType} from '../../redux/Clients/clients-reducer'

const ClientsSearchFormValidate = (values: FormType) => {
  const errors = {}
  return errors
}

type FormType = {
  term: string
  gallery: string
}

type PropsType = {
  clientsFilter: ClientsFilterType
  onFilterChanged: (filter: ClientsFilterType) => void
}


export const ClientSearchFormFormik: React.FC<PropsType> = React.memo(({
  clientsFilter,
  onFilterChanged
}) => {

  const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const filter: ClientsFilterType = {
      term: values.term,
      gallery: values.gallery
    }
    onFilterChanged(filter)
    setSubmitting(false)
  }

  const initialValues = {
    term: clientsFilter.term,
    gallery: clientsFilter.gallery
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={ClientsSearchFormValidate}
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
                type="text"
                name="term"
                placeholder={"Search..."}
              />

              <Field name="gallery" as="select">
                <option value="any">All</option>
                <option value="1">Only with Tattoos Gallery</option>
                <option value="0">Only without Tattoos Gallery</option>
              </Field>
              <button
                className={"btn btn--sm"}
                type="submit" disabled={isSubmitting}
              >
                Find
              </button>
            </Form>
          )
        }
      }
    </Formik>
  )
})
