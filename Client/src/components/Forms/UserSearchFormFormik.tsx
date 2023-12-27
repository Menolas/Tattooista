import * as React from "react"
import {Field, Form, Formik} from "formik"
import {UsersFilterType} from "../../redux/Users/users-reducer"

const ClientsSearchFormValidate = (values: FormType) => {
  return {}
}

type FormType = {
  term: string
  role: string
}

type PropsType = {
  filter: UsersFilterType
  onFilterChanged: (filter: UsersFilterType) => void
}


export const UserSearchFormFormik: React.FC<PropsType> = React.memo(({
  filter,
  onFilterChanged
}) => {

  const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const filter: UsersFilterType = {
      term: values.term,
      role: values.role
    }
    onFilterChanged(filter)
    setSubmitting(false)
  }

  const initialValues = {
    term: filter.term,
    role: filter.role
  }

  return (
    <Formik
      initialValues={initialValues}
      //validate={ClientsSearchFormValidate}
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

              <Field name="role" as="select">
                <option value="any">All</option>
                <option value="1">Only with Admin Role</option>
                <option value="0">Only with User Role</option>
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
