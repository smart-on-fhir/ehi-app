import { useState } from "react";

interface UseCookieProps {
  cookie: string;
  updateCookie: (value: string, customDays?: number) => void;
  deleteCookie: (name: string) => void;
}

/**
 * Delete a cookie
 * @param {String} name The name of the cookie to delete
 *
 * @return {void}
 */
function deleteCookie(name: string) {
  setCookie(name, "", -1);
}

/**
 * Set (create or update) a cookie.
 * @param {String} name The name of the cookie
 * @param {String} value The value of the cookie
 * @param {Number} days (optional) The cookie lifetime in days. If omitted,
 *                                 the cookie is a session cookie.
 * @return {void}
 */
function setCookie(name: string, value: string, days?: number) {
  if (String(name).indexOf(";") > -1) {
    throw Error("The cookie name cannot contain ';'");
  }
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

/**
 * Reads a cookie identified by it's name.
 * @param {String} name The name of the cookie
 * @return {String|null} The value of the cookie or null on failure
 */
function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function useCookie(
  name: string,
  defaultDays?: number,
  initialValue?: string
): UseCookieProps {
  // If this cookie has no value and we've been provided an initial value, use it to initialize our cookie
  if (getCookie(name) === null && initialValue) {
    setCookie(name, initialValue, defaultDays);
  }
  const [localCookie, setLocalCookie] = useState(
    getCookie(name) || initialValue || ""
  );

  function updateCookie(value: string, customDays?: number) {
    setCookie(name, value, customDays || defaultDays);
    setLocalCookie(value);
  }

  return { cookie: localCookie, updateCookie, deleteCookie };
}
