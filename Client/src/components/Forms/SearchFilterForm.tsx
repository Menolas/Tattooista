import * as React from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { ReactComponent as SearchIcon } from "../../assets/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assets/svg/filter.svg";
import { SearchFilterType, SelectOptionType } from "../../types/Types";
import { FormSelect } from "./formComponents/FormSelect";
import {handleEnterClick} from "../../utils/functions";

type PropsType = {
  isFavourite?: boolean;
  options: Array<SelectOptionType>;
  filter: SearchFilterType;
  onFilterChanged: (filter: SearchFilterType) => void;
};

export const SearchFilterForm: React.FC<PropsType> = React.memo(({
 isFavourite,
 options,
 filter,
 onFilterChanged
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const submit = (values: { term: string; condition: string; isFavourite: string }, formikHelpers: FormikHelpers<{ term: string; condition: string; isFavourite: string }>) => {
    const filter: SearchFilterType = {
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
    isFavourite: filter.isFavourite || ""
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
                  <SearchIcon/>
                </div>
                <FormSelect
                    name="condition"
                    options={options}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      handleEnterClick(event, handleSubmit)
                    }}
                />
                {isFavourite && (
                    <>
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
                      <label
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Click to show only favourite clients"
                          htmlFor="isFavourite"
                          className="isFavourite"></label>
                    </>
                  )
                }
                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Filter Clients"
                    className={"btn btn--sm btn--transparent search-submit"}
                    type="submit" disabled={isSubmitting}
                >
                  <FilterIcon/>
                </button>
              </Form>
          )
        }}
      </Formik>
  );
});

SearchFilterForm.displayName = "SearchFilterForm";
