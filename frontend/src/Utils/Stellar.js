import {getCookie} from './Cookie';
import * as STELLAR_CONST from '../Constants/StellarConstant';
import {deletCookie} from './Cookie';

/**
 * get - Check if user is logged in
 *
 * @returns Boolean        returns a boolean if user is logged in
 */
const isUserloggedIn = () => {
    let stellarAuthCookie = getCookie(STELLAR_CONST.LOGIN_COOKIE);

    if ((typeof stellarAuthCookie !== 'undefined') && (stellarAuthCookie !== '')) {
        return true;
    }
    return false;
}

/**
 * get - the state of page
 *
 * @returns String        returns a string the state of page
 */
const getState = () => {
    let stateCookie = getCookie(STELLAR_CONST.STATE_COOKIE);

    if ((typeof stateCookie !== 'undefined') && (stateCookie !== '')) {
        return stateCookie;
    }
    return STELLAR_CONST.LOGIN_STATE;
}

/**
 * Log Out User
 */
const logoutUser = () => {
    deletCookie(STELLAR_CONST.LOGIN_COOKIE);
    deletCookie(STELLAR_CONST.STATE_COOKIE);
    window.location.reload();
}

/**
 * Get User Registered Projects
 */
const getProjectsAssigned = () => {
    let projectCookie = getCookie(STELLAR_CONST.PROJECT_COOKIE);

    if ((typeof projectCookie !== 'undefined') && (projectCookie !== '')) {
        return projectCookie;
    }
    return '';
}

export {
    isUserloggedIn,
    getState,
    logoutUser,
    getProjectsAssigned

};