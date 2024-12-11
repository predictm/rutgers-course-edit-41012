import { useState, useEffect, useCallback } from 'react';

/**
 * Determines a value if it's an object
 *
 * @param {object} value
 */
const isObject = value => value !== null && typeof value === 'object';

/**
 * Returns true if the value is RegExp
 *
 * @param {RegExp} value
 */
const isRegExp = value => value instanceof RegExp;

/**
 * Custom hooks to validate your Form
 *
 * @param {object} stateSchema model you stateSchema.
 * @param {object} validationSchema model your validation.
 * @param {function} callback function to be execute during form submission.
 */

const useForm = (stateSchema = {}, validationSchema = {}, callback) => {
  const [state, setState] = useState(stateSchema);
  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Used to disable submit button if there's an error in state
  // or the required field in state has no value.
  // Wrapped in useCallback to cached the function to avoid intensive memory leaked
  // in every re-render in component
  const validateState = useCallback(() => {
    const hasErrorInState = Object.keys(validationSchema)?.some(key => {
      const isInputFieldRequired = validationSchema[key]?.required;
      const stateValue = state[key]?.value; // state value
      const stateError = state[key]?.error; // state error

      return (isInputFieldRequired && !stateValue) || stateError;
    });

    return hasErrorInState;
  }, [state, validationSchema]);

  // Disable button in inital render;
  useEffect(() => {
    setDisable(validateState());
  }, [validateState]);

  // For every changed in our state this will be fired
  // To be able to disable the button
  useEffect(() => {
    if (isDirty) {
      setDisable(validateState());
    }
  }, [state, isDirty, validateState]);

  // Event handler for handling changes in input.
  // eslint-disable-next-line
  const handleOnChange = (name, value) => {
    setIsDirty(true);

    let error = '';
    if (validationSchema[name]?.required) {
      if (!value) {
        error = 'Field Required';
      }
    }

    if (
      validationSchema[name]?.validator?.checkRequired &&
      validationSchema[name]?.validator?.checkRequired()
    ) {
      error = !value ? validationSchema[name]?.validator?.error : '';
    }

    if (isObject(validationSchema[name]?.validator)) {
      if (validationSchema[name]?.validator?.regEx) {
        if (!isRegExp(validationSchema[name]?.validator?.regEx)) {
          throw new Error("Your RegExp value isn't a valid RegExp Object");
        }

        // Test your defined RegExp...
        if (value && !validationSchema[name]?.validator?.regEx?.test(value)) {
          const { validator } = validationSchema[name];
          // eslint-disable-next-line prefer-destructuring
          error = validator.error;
        }
      } else if (validationSchema[name]?.validator?.compare) {
        if (value && validationSchema[name]?.validator?.compare(value)) {
          const { validator } = validationSchema[name];
          // eslint-disable-next-line prefer-destructuring
          error = validator.error;
        }
      }
    }
    else{
      error=""
    }

    setState(prevState => ({
      ...prevState,
      [name]: { value, error },
    }));

    return error;
  };

  const handleOnSubmit = () => {
    setIsDirty(true);

    const errors = Object.keys(stateSchema).map(name =>
      handleOnChange(name, state[name].value)
    );

    return errors.some(error => error !== '') ? false : true;
  };

  return {
    handleOnChange,
    handleOnSubmit,
    state,
    setIsDirty,
    setState,
    disable,
  };
};

export default useForm;
