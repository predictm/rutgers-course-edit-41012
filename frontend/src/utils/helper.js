import moment from 'moment-timezone';

export const formatDateTime = (
  dateTimeInUTC,
  format = 'hh:mm A (z) dddd, MMMM Do, YYYY',
  timezone = moment.tz.guess()
) => {
  if (!dateTimeInUTC) return '';

  const date = moment.utc(dateTimeInUTC).tz(timezone);

  return date.format(format);
};

// function to delete cookies
export const deleteCookies = () => {
  const Cookies = document.cookie.split(';');

  // set 1 Jan, 1970 expiry for every cookies
  for (let i = 0; i < Cookies.length; i++)
    document.cookie = Cookies[i] + '=;expires=' + new Date(0).toUTCString();
};

export const sortArray = (data, key, sortingOrder = 1) => {
  return (
    data?.slice()?.sort((a, b) => {
      const firstValue =
        typeof a[key] === 'string' ? a[key]?.toLowerCase() : a[key];
      const secondValue =
        typeof b[key] === 'string' ? b[key]?.toLowerCase() : b[key];

      if (firstValue < secondValue) {
        return sortingOrder * -1;
      }
      if (firstValue > secondValue) {
        return sortingOrder * 1;
      }
      return 0;
    }) || []
  );
};

export const sortByDate = (data, sortingOrder = 1) => {
  return (
    data?.slice()?.sort((a, b) => {
      const aDate = a?.modified_at || a?.created_at;
      const bDate = b?.modified_at || b?.created_at;

      if (aDate && bDate) {
        return (
          (moment(aDate).format('x') - moment(bDate).format('x')) * sortingOrder
        );
      }

      return 0;
    }) || []
  );
};

export const getComparator = order => {
  return order === 'desc' ? -1 : 1;
};

export const allPropHasValue = propsObject => {
  return Object.keys(propsObject)?.every(
    item =>
      typeof propsObject[item] !== 'undefined' &&
      propsObject[item] !== null &&
      propsObject[item] !== ''
  );
};

export const validateStartEndDate = (start, end) => {
  if (start && end && moment(end).diff(start, 'd') < 0) {
    return false;
  }

  return true;
};

export const ConvertToNumber = string => {
  return string === '' ||
    string === null ||
    typeof string === 'undefined' ||
    isNaN(string)
    ? ''
    : parseFloat(string);
};

export const ConvertToUSFormat = string => {
  return string === '' ||
    string === null ||
    typeof string === 'undefined' ||
    isNaN(string)
    ? ''
    : parseFloat(string).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};


export const getUserNameTags = string => {
  const words = string?.split(' ') || [];

  return (
    words
      ?.filter(word => word?.startsWith('@'))
      ?.map(word => word?.replace('@', '')) || []
  );
};

export const prepareQueryString = params => {
  return Object.entries(params)
    ?.map(([field, value]) => {
      value = value === 'all' ? '' : value;
      return `${field}=${encodeURIComponent(value || '')}`;
    })
    .filter(query => /^.+=.+$/.test(query))
    .join('&');
};

export const formatCredit = (credit) => {

  const creditPoint = (parseInt(credit)/10).toFixed(1);
  console.log(typeof(creditPoint),'creditPoint');

  return (isNaN(creditPoint) || creditPoint === "0.0") ? '0' : creditPoint;

}

export const formatTime = (time) => {
  try {
    return time ? time.substring(0, 2) + ":" + time.substring(2, 4) : null;
  } catch (err) {
    console.log(err);
  }
  return null;
}


export const formatSalary = (salary) => {
  let newSalary = salary;
  // Check if salary is undefined or null
  if (newSalary === undefined || newSalary === '') {
    return "";
  }

  // Remove commas from the salary string
  newSalary = newSalary?.toString().replace(/,/g, '');

  // Convert newSalary to string
  let salaryStr = String(newSalary);
  // Split newSalary string into integer and decimal parts if present
  let parts = salaryStr.split(".");
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Add commas after every three numbers in the integer part
  let formattedInteger = "";
  for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      formattedInteger = "," + formattedInteger;
    }
    formattedInteger = integerPart[i] + formattedInteger;
  }

  // Concatenate integer and decimal parts
  let formattedSalary = formattedInteger + decimalPart;
  return formattedSalary
}
export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters from the input phone number
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Check the length of the digitsOnly string to determine the format
  if (digitsOnly.length <= 10) {
      // Format: ###-###-###
      return digitsOnly.replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, first, second, third) => {
          let parts = [first];
          if (second) parts.push(`-${second}`);
          if (third) parts.push(`-${third}`);
          return parts.join('');
      });
  } else if (digitsOnly.length > 10) {
      // Format: ###-###-### ext:####
      return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, '$1-$2-$3 ext:$4');
  } else {
      // If the length doesn't match any of the expected formats, return the original input
      return phoneNumber;
  }
}


