import axios from 'axios';
import { API_BASE_PATH, API_PATH } from '../utils/config';
import { routeUrls } from 'utils/constant';
import { getAuthToken } from 'utils/common';

const getBaseUrl = () => {
  let baseUrl = API_BASE_PATH;

  return baseUrl;
};

const instance = axios.create({
  baseURL: getBaseUrl(),
});

const notLoginCall = config => {
  return config?.url !== API_PATH.LOGIN;
};

const tokenInterceptor = instance.interceptors.request.use(
  request => {
    if (notLoginCall(request) && !request.headers.Authorization) {
      const token = getAuthToken();
      if (token) {
        request.headers.Authorization = `Token ${token}`;
      }
    }
    request.headers['ngrok-skip-browser-warning'] = 69420;
    return request;
  },
  null,
  { synchronous: true }
);

let navigate;
export const injectNavigator = navigator => {
  navigate = navigator;
};

const catchErrors = err => {
  if (401 === err?.response?.status) {
    if (navigate) {
      navigate(routeUrls.login, { replace: true });
    } else {
      window.location = routeUrls.login;
    }
  } else if (403 === err?.response?.status) {
    // toast.dismiss();
    if (/user-logout\/$/.test(err.request.responseURL)) {
      if (navigate) {
        navigate(routeUrls.login, { replace: true });
      } else {
        window.location = routeUrls.login;
      }
    } else {
      //    toast.error('The action you have performed is unauthorized.');
    }
  }

  throw err;
};

window.addEventListener('storage', () => {
  const token = getAuthToken();
  if (token) {
    instance.interceptors.request.eject(tokenInterceptor);
    instance.interceptors.request.use(tokenInterceptor);
  }
});

export const post = (url, data, config) => {
  return instance.post(url, data, config).catch(catchErrors);
};

export const patch = (url, data, config) => {
  return instance.patch(url, data, config).catch(catchErrors);
};

export const put = (url, data, config) => {
  return instance.put(url, data, config).catch(catchErrors);
};

export const del = (url, data, config) => {
  return instance.delete(url, data, config).catch(catchErrors);
};

export const get = (url, config) => {
  return instance.get(url, config).catch(catchErrors);
};

// instance.interceptors.response.use(
//   response => {
//     if (
//       response?.config?.url === API_PATH.LOGIN ||
//       response?.config?.url === API_PATH.GOOGLE_LOGIN ||
//       response?.config?.url === API_PATH.FACEBOOK_LOGIN
//     ) {
//       let token = response?.data?.token
//       let user = response?.data?.user
//       localStorage.setItem("keyCloak", JSON.stringify({ token, user }))
//     }
//     // console.log(response)
//     return response
//     console.log(error)
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       error.response.data.detail === "Invalid token."
//     ) {
//       localStorage.removeItem("keyCloak")
//       window.location.href = "." + PATH.LOGIN
//     }
//     // error.response.status === 403 && error.response.data.detail === "CSRF Failed: CSRF token missing or incorrect."
//     return Promise.reject(error)
//   }
// )  },
//   error => {
//

export default instance;
