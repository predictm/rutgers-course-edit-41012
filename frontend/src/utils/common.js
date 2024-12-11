import moment from 'moment-timezone';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw, EditorState, ContentState } from 'draft-js';

import { localStorageKeys } from 'utils/config';
import {
  announcementTypes,
  routeUrls,
  systemNotificationTypes,
} from 'utils/constant';
import { deleteCookies } from './helper';

export const getTokenInfo = () => {
  try {
    const savedSession = JSON.parse(
      localStorage.getItem(localStorageKeys.accessToken) || null
    );
    return savedSession;
  } catch (e) {
    return '';
  }
};
export const isTokenValid = tokenInfo => {
  tokenInfo ||= getTokenInfo();
  if (
    tokenInfo?.expiryTime &&
    moment(tokenInfo?.expiryTime).diff(moment(new Date()), 'minutes') <= 0
  ) {
    return false;
  }

  return true;
};

export const getAuthToken = () => {
  const savedSession = getTokenInfo();
  return isTokenValid(savedSession) && savedSession?.token;
};

export const userTokenExists = () => {
  return Boolean(getAuthToken());
};

export const checkAndSetUserLoggedIn = setIsUserLoggedIn => {
  const userTokenFound = userTokenExists();
  if (userTokenFound) {
    setIsUserLoggedIn(true);
  }
};

export const getUserData = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKeys.user || null));
  } catch (e) {
    return '';
  }
};

export const handleLoginSuccess = (token, userData, navigate) => {
  let expiryTime;
  const getDateTime = date => moment.utc(date).tz(moment.tz.guess());
  if (localStorage.getItem('remember_me')) {
    expiryTime = getDateTime(new Date()).add(90, 'd');
  } else {
    expiryTime = getDateTime(new Date()).add(4, 'h');
  }

  localStorage.setItem(
    localStorageKeys.accessToken,
    JSON.stringify({ token, expiryTime })
  );
  localStorage.setItem(
    localStorageKeys.user,
    JSON.stringify({
      ...userData,
    })
  );

  navigate(routeUrls.dashboard);
};

export const carryOutLogout = setIsUserLoggedIn => {
  localStorage.removeItem(localStorageKeys.user);
  localStorage.removeItem(localStorageKeys.accessToken);
  sessionStorage.clear();
  deleteCookies();
  setIsUserLoggedIn?.(false);
};

export const sortComments = commentsList => {
  return commentsList?.sort((a, b) => {
    const commentDateA = a?.modified_at || a?.created_at;
    const commentDateB = b?.modified_at || b?.created_at;
    return moment(commentDateB).diff(commentDateA);
  });
};

export const calculateBreakEvenValue = ({
  studentsCount,
  credits,
  inStateTuition,
  salary,
  fringe = 1.0765,
}) => {
  const breakEven =
    parseFloat(studentsCount || 0) *
      parseFloat(credits || 0) *
      parseFloat(inStateTuition || 0) -
    parseFloat(salary || 0) * parseFloat(fringe || 0);
  return breakEven?.toFixed(2);
};

export const calculateBreakEvenStudents = ({
  credits,
  inStateTuition,
  salary,
  fringe = 1.0765,
}) => {
  const tuitionFee = parseFloat(credits || 0) * parseFloat(inStateTuition || 0);
  const salaryFringe = parseFloat(salary || 0) * parseFloat(fringe || 0);

  const breakEvenStudents = tuitionFee > 0 ? salaryFringe / tuitionFee : 0;

  return Math.ceil(breakEvenStudents);
};

export const calculateProjRevenue = ({
  credits,
  inStateTuition,
  projectedEnrollment
}) => {
  const result = parseFloat(credits || 0) == 0 
  ? parseFloat(inStateTuition || 0) * parseFloat(projectedEnrollment || 0) 
  : parseFloat(inStateTuition || 0) * parseFloat(projectedEnrollment || 0) * parseFloat(credits || 0);
  return Math.round(result);
};

export const calculateNetRevenue = ({
  salary,
  projRev,
  fringe = 1.0765
}) => {
  const result = parseFloat(projRev || 0) - (parseFloat(salary || 0) * parseFloat(fringe || 0))
  return Math.round(result)
}


export const isAdmin = userRole => {
  return userRole === 'ADMIN';
};

export const convertDraftToHtml = editorState => {
  return (
    editorState && draftToHtml(convertToRaw(editorState.getCurrentContent()))
  );
};

export const convertHtmlToDraft = html => {
  const contentBlock = html && htmlToDraft(html);
  let editorState;

  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks,
      contentBlock.entityMap
    );
    editorState = EditorState.createWithContent(contentState);
  }

  return editorState;
};

export const getNotificationColor = item => {
  return (
    [...announcementTypes, systemNotificationTypes].find(
      type => type?.value === item?.notification_type
    )?.colorCode || '#F5F5F5'
  );
};

export const getNotificationIcon = item => {
  return [...announcementTypes, systemNotificationTypes].find(
    type => type?.value === item?.notification_type
  )?.icon;
};

export const redirectToRutgersLogin = navigate => {
  if(window.location.hostname === 'localhost'){
    window.open("https://rutgers-course-edit-41-staging.botics.co"+routeUrls.ruterLogin,'_self');
  }else{
    window.open(routeUrls.ruterLogin,'_self');
  }
}
