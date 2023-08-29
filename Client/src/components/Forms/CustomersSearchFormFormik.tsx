import * as React from 'react'
import {Field, Form, Formik} from 'formik'
import {CustomersFilterType} from '../../redux/Customers/customers-reducer'

const CustomersSearchFormValidate = (values: FormType) => {
  const errors = {}
  return errors
}

type FormType = {
  term: string
  status: string
}

type PropsType = {
  customersFilter: CustomersFilterType
  onFilterChanged: (filter: CustomersFilterType) => void
}

export const CustomersSearchFormFormik: React.FC<PropsType> = React.memo(({
  customersFilter,
  onFilterChanged
}) => {
  const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const filter: CustomersFilterType = {
      term: values.term,
      status: values.status
    }
    onFilterChanged(filter)
    setSubmitting(false)
  }
  const initialValues = {
    term: customersFilter.term,
    status: customersFilter.status
  }
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validate={CustomersSearchFormValidate}
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

              <Field name="status" as="select">
                <option value="null">All</option>
                <option value="true">Only contacted</option>
                <option value="false">Only not contacted</option>
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
