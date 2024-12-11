const validator = {
  name: {
    regEx: /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
    error: 'Only alphabetic letters are allowed with spaces in between.',
  },
  email: {
    regEx:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    error: 'Invalid email address.',
  },
  phone: {
    regEx: /^\d+$/,
    error: 'Enter a valid phone number. Only digits are allowed.',
  },
  url: () => {
    const regEx = new RegExp(
      '^(https?:\\/\\/)' + // protocol
        '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' + // domain
        '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
        '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragments
      'i'
    );
    return {
      compare: value => {
        return value?.length ? !regEx.test(value) : false;
      },
      error: 'Please enter valid URL. Eg: https://www.someschool.com',
    };
  },
  phoneWithExt: {
    regEx: /^\+\d{1,4}\s\d+/,
    error: 'Enter a valid phone number with phone code(ex: +1 8888888888).',
  },
  password: {
    // regEx: /(?=^.{1,8}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    regEx: /^(?=.*\d).{8,}$/,
    error:
      'Password must be minimum length 8 (with at least a lowercase letter and a number)',
    length: {
      minimum: 8,
      message: '^Your password must be at least 8 characters',
    },
  },
  currentPassword: {
    regEx: /(?=^.{8,16}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    error: 'Password must be minimum length 8 characters',
    length: {
      minimum: 8,
      message: '^Your password must be at least 8 characters',
    },
  },
  numeric: {
    regEx: /^\d+$/,
    error: 'Only numeric digits allowed.',
  },
  requiredIf: dependencyCheck => ({
    checkRequired: value => {
      return dependencyCheck() && !value;
    },
    error: 'Field is Required',
  }),
  checkLength: (error, length = 1) => ({
    compare: value => {
      return !(value?.length >= length);
    },
    error: error || 'Please select at least 1 item',
  }),
  checkValidPhone: (length =1) => ({   
    compare: value => {
      const status = value?.length ? /^\d+$/.test(value) : false;
      return !(value?.length >= length) || !status;
    },
    error: 'Enter a valid 8 digit phone number. Only digits are allowed.',
  }),
  exactLengthChars: (error, length) => {
    return {
      regEx: new RegExp(`^[\\da-z]{${length}}$`, 'i'),
      error,
    };
  },
};

export default validator;
