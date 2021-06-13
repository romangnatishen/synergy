/**
 * @module requestData
 * @function
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 * @param {Object} params
 * @var {String} access_token
 * @var {Object} requestData
 * @var {Boolean} isData
 * @var {Boolean} isParams
 * @var {Boolean} isAccessToken
 * @var {Boolean} isId
 * @return {Object}
 */
import { DeviceUUID } from 'device-uuid';

export default (method, url, data, params, headers) => {
  const access_token = localStorage.getItem('access_token');
  const isData = data !== '' && data !== undefined;
  const isParams = params !== '' && params !== undefined;
  let requestData = {};
  const device_uuid = new DeviceUUID().get();

  if (access_token) {
    const apiKey = localStorage.getItem('x-api-key');
    const authorizationStr = `Bearer ${access_token}`;

    requestData = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        authorization: authorizationStr,
        device_uuid: device_uuid,
        'x-access-token': access_token,
        'x-api-key': apiKey,
        ...headers,
      },
    };
  } else {
    requestData = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
  }

  if (isData) {
    requestData.data = data;
    const isId = data.id === '' || data.id === undefined;
    if (isId) {
      delete data.id;
    }
  }

  if (isParams) {
    // console.log("header params");
    // console.log(params);

    requestData.params = params;
  }

  // requestData.headers.Authorization = `Basic ${Buffer.from(
  //   process.env.VUE_APP_AUTHORIZATION_LOGIN +
  //     ':' +
  //     process.env.VUE_APP_AUTHORIZATION_PASSWORD
  // ).toString('base64')}`;

  return requestData;
};
