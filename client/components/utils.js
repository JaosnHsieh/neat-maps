// refer to https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options
export const postData = (url = '', data = {}) =>
  fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // for cross-origin request https://stackoverflow.com/a/38935838/6414615
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

/**
 * fetch needs absolute URL
 * Error: only absolute urls are supported
 */
export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
    : 'http://localhost:3000';

/**
 * csvText.split(',') will encounter bug when cellText like "123, USA" so get sophisticated csv parser function from the link
 * CSVtoArray
 * https://stackoverflow.com/a/41563966/6414615
 */
export const csvToArray = text => {
  let p = '',
    row = [''],
    ret = [row],
    i = 0,
    r = 0,
    s = !0,
    l;
  for (l of text) {
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if (',' === l && s) l = row[++i] = '';
    else if ('\n' === l && s) {
      if ('\r' === p) row[i] = row[i].slice(0, -1);
      row = ret[++r] = [(l = '')];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
};
