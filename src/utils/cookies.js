/**
 * Cookie utility functions for managing authentication
 */

// Set a cookie with optional expiration and path
export const setCookie = (name, value, options = {}) => {
  const { days, path = '/' } = options;
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`;
  
  // If days is provided, set expiration
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  // Add SameSite attribute for security
  cookieString += '; SameSite=Lax';
  
  document.cookie = cookieString;
};

// Get a cookie by name
export const getCookie = (name) => {
  const cookieArr = document.cookie.split(';');
  
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');
    const cookieName = cookiePair[0].trim();
    
    if (cookieName === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  
  return null;
};

// Remove a cookie by setting its expiration to the past
export const removeCookie = (name, path = '/') => {
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// Set JSON data as a cookie (serialized)
export const setJsonCookie = (name, value, options = {}) => {
  const jsonValue = JSON.stringify(value);
  setCookie(name, jsonValue, options);
};

// Get JSON data from a cookie (deserialized)
export const getJsonCookie = (name) => {
  const cookieValue = getCookie(name);
  if (!cookieValue) return null;
  
  try {
    return JSON.parse(cookieValue);
  } catch (error) {
    console.error('Error parsing JSON cookie:', error);
    return null;
  }
};