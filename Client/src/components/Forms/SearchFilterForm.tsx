import * as React from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { ReactComponent as SearchIcon } from "../../assets/svg/search.svg";
import { SearchFilterType, SelectOptionType } from "../../types/Types";
import { FormSelect } from "./formComponents/FormSelect";

const handleChange = () => {
  console.log("HandleChange!!!");
};

type FormType = {
  term: string;
  condition: string;
};

type PropsType = {
  options: Array<SelectOptionType>;
  filter: SearchFilterType;
  onFilterChanged: (filter: SearchFilterType) => void;
};

export const SearchFilterForm: React.FC<PropsType> = React.memo(({
 options,
 filter,
 onFilterChanged
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const submit = (values: FormType, formikHelpers: FormikHelpers<FormType>) => {
    const filter: SearchFilterType = {
      term: values.term,
      condition: values.condition
    };
    onFilterChanged(filter);
    formikHelpers.setSubmitting(false);
    formikHelpers.resetForm();
  };

  const initialValues = {
    term: filter.term,
    condition: filter.condition
  };

  return (
      <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={submit}
      >
        {({ isSubmitting, handleSubmit }) => {
          const handleEnterClick = (event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSubmit();
            }
          };

          return (
            <Form
                ref={formRef}
                className={"form search-form"}
                onKeyDown={handleEnterClick}
            >
              <div className={'search-form__search-wrap'}>
                <Field
                    className={"search-input"}
                    type="text"
                    name="term"
                    placeholder={"Search..."}
                />
                <button
                    className={"btn btn--sm btn--transparent search-submit"}
                    type="submit" disabled={isSubmitting}
                >
                  <SearchIcon />
                </button>
              </div>
              <FormSelect
                  name="condition"
                  options={options}
                  handleChange={handleChange}
                  onKeyDown={handleEnterClick}
              />
            </Form>
        )}}
      </Formik>
  );
});

SearchFilterForm.displayName = "SearchFilterForm";
