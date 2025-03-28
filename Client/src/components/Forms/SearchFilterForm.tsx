import * as React from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { ReactComponent as SearchIcon } from "../../assets/svg/search.svg";
import { ReactComponent as FilterIcon } from "../../assets/svg/filter.svg";
import { SearchFilterType, SelectOptionType } from "../../types/Types";
import { FormSelect } from "./formComponents/FormSelect";
import {handleEnterClick} from "../../utils/functions";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ReactComponent as StarFilled} from "../../assets/svg/star-filled.svg";
import {ReactComponent as ArrowRotateLeftIcon} from "../../assets/svg/arrow-rotate-left.svg";

type PropsType = {
  isFavourite?: boolean;
  isRated?: boolean;
  options: Array<SelectOptionType>;
  filter: SearchFilterType;
  onFilterChanged: (filter: SearchFilterType) => void;
};

export const SearchFilterForm: React.FC<PropsType> = React.memo(({
 isFavourite,
 isRated,
 options,
 filter,
 onFilterChanged
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const submit = (
      values: { term: string; condition: string; isFavourite: boolean, rate: string | number, },
      formikHelpers: FormikHelpers<{ term: string; condition: string; isFavourite: boolean; rate: string | number; }>
  ) => {
    const filter: SearchFilterType = {
      term: values.term,
      condition: values.condition,
      isFavourite: values.isFavourite,
      rate: values.rate,
    };
    onFilterChanged(filter);
    formikHelpers.setSubmitting(false);
    formikHelpers.resetForm();
  };

  const initialValues = {
    term: filter.term,
    condition: filter.condition,
    isFavourite: filter.isFavourite ?? false,
    rate: filter.rate ?? "any"
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
                { isRated &&
                  <FieldWrapper
                      wrapperClass='search-form__rate'
                      name='rate'
                      label="Rate your experience"
                  >
                      <div className="rate">
                          {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                  key={num}
                                  type="button"
                                  className={`btn btn--icon rate ${num <= values.rate ? "selected" : ""}`}
                                  onClick={() => {
                                      const currentRate = values.rate;
                                      setFieldValue("rate", currentRate === num ? 0 : num);
                                  }}
                              >
                                  <StarFilled />
                              </button>
                          ))}
                      </div>
                  </FieldWrapper>
                }
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
                { isFavourite && (
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
                <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Reset search"
                  type="button"
                  className="btn btn--sm btn--transparent search-reset"
                  onClick={() => {
                      const resetValues = {
                          term: '',
                          condition: 'any',
                          isFavourite: false,
                          rate: 'any',
                      };
                      onFilterChanged(resetValues);
                      setFieldValue('term', '');
                      setFieldValue('condition', 'any');
                      setFieldValue('isFavourite', false);
                      setFieldValue('rate', 'any');
                  }}
                  >
                    <ArrowRotateLeftIcon />
                </button>
              </Form>
          )
        }}
      </Formik>
  );
});

SearchFilterForm.displayName = "SearchFilterForm";
