/**
 * get - Retrieve the cookie value
 *
 * @param   {string} key   keyname of the cookie
 * @returns {array}        returns an array containing the values
 */
const getCookie = ( key ) => {

    if ((typeof window !== 'undefined')&& (typeof document !== 'undefined')) {
        let cookieSet = document.cookie.split('; '),
            cookieArray = cookieSet.filter((cookie) => {
                return cookie.indexOf(`${key}=`) === 0;
            }),
            cookie = cookieArray[0];

        return cookie ?
            cookie.split(`${key}=`)[1] !== '' ?
            cookie.split(`${key}=`)[1].replace(/(^[,\s]+)|([,\s]+$)/g, '').split(',')[ 0 ] : '' : '';
    }

    return '';
}


/**
 * delete - Delete a cookie
 *
 * @param   {string} key   keyname of the cookie
 * @returns {boolean}      returns true once the cookie is deleted  | returns false if code renders server side
 */
const deletCookie = (key) => {
    if ((typeof window !== 'undefined')&& (typeof document !== 'undefined')) {
        let expiryDate = new Date(0).getTime(),
            newCookie = `${key}=;path=/;expires=${expiryDate}`;

        document.cookie = newCookie;

        return true;
    }

    return false;
}


/**
 * create - Create a cookie
 *
 * @param   {string} key          keyname of the cookie
 * @param   {any} value           value that needs to be given to the cookie
 * @param   {number} expiryDays   number of days from now the cookie should expire
 * @returns {boolean}             true - once the cookie is created | false - if code renders server side
 */
const createCookie = (key, value, expiryDays = 90) => {
    if ((typeof window !== 'undefined')&& (typeof document !== 'undefined')) {
        let currentDate = new Date(),
            expiryDate = new Date(currentDate.getTime() + expiryDays * 24 * 60 * 60 * 1000),
            newCookie = `${key}=${value};path=/;expires=${expiryDate}`;

        document.cookie = newCookie;

        return true;
    }

    return false;
}


export {
    createCookie,
    getCookie,
    deletCookie
};