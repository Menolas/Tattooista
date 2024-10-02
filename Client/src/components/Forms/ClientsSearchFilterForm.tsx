import * as React from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { ReactComponent as SearchIcon } from "../../assets/svg/search.svg";
import { ClientsSearchFilterType, SelectOptionType } from "../../types/Types";
import { FormSelect } from "./formComponents/FormSelect";
import {handleEnterClick} from "../../utils/functions";

type PropsType = {
  options: Array<SelectOptionType>;
  filter: ClientsSearchFilterType;
  onFilterChanged: (filter: ClientsSearchFilterType) => void;
};

export const ClientsSearchFilterForm: React.FC<PropsType> = React.memo(({
 options,
 filter,
 onFilterChanged
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const submit = (values: ClientsSearchFilterType, formikHelpers: FormikHelpers<ClientsSearchFilterType>) => {
    const filter: ClientsSearchFilterType = {
      term: values.term,
      condition: values.condition,
      isFavourite: values.isFavourite
    };
    onFilterChanged(filter);
    formikHelpers.setSubmitting(false);
    formikHelpers.resetForm();
  };

  const initialValues = {
    term: filter.term,
    condition: filter.condition,
    isFavourite: filter.isFavourite
  };

  return (
      <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={submit}
      >
        {({ values, isSubmitting, handleSubmit, setFieldValue }) => {

          return (
              <Form
                  ref={formRef}
                  className={"form search-form"}
              >
                <div className={'search-form__search-wrap'}>
                  <Field
                      className={"search-input"}
                      type="text"
                      name="term"
                      placeholder={"Search..."}
                      onKeyDown={(event: React.KeyboardEvent) => {
                        handleEnterClick(event, handleSubmit)
                      }}
                  />
                </div>
                <FormSelect
                    name="condition"
                    options={options}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      handleEnterClick(event, handleSubmit)
                    }}
                />
                <Field
                    type="checkbox"
                    name="isFavourite"
                    id="isFavourite"
                    checked={values.isFavourite}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('isFavourite', e.target.checked);
                    }}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      handleEnterClick(event, handleSubmit)
                    }}
                />
                <label htmlFor="isFavourite" className="isFavourite"></label>
                <button
                    className={"btn btn--icon btn--sm btn--transparent search-submit"}
                    type="submit" disabled={isSubmitting}
                >
                  <SearchIcon/>
                </button>
              </Form>
          )
        }}
      </Formik>
  );
});

ClientsSearchFilterForm.displayName = "ClientsSearchFilterForm";
