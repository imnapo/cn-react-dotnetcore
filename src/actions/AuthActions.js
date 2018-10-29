import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS,
} from './Types';
import axios from 'axios';
const AUTH_SERVER_URL = 'http://localhost:5000';

export const registerUser = (data, callback) => {
  return (dispatch) => {

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    var params = `email=${email}&password=${password}&fullName=${fullname}`;

    axios.post(`${AUTH_SERVER_URL}/api/auth/register`, params)
          .then(function (response) {
              dispatch({
                  type: REGISTER_USER_SUCCESS,
              })
              if(callback)
                callback();

          })
          .catch(function (error) {
              console.log('Register failed with error => ', error);
              dispatch({ type: REGISTER_USER_FAIL });
          });
  }
}
