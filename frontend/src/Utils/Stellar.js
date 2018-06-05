import {getCookie} from './Cookie';
import * as STELLAR_CONST from '../Constants/StellarConstant';

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

export {
    isUserloggedIn,
    getState
};