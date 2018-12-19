import {
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  FETCH_TOKEN,
} from './Types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const AUTH_SERVER_URL = 'http://localhost:5000';

export const registerUser = ({email, password, fullName}, callback) => {
  return (dispatch) => {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    var params = `email=${email}&password=${password}&fullName=${fullName}`;
    
    axios.post(`${AUTH_SERVER_URL}/api/auth/register`, params)
          .then(function (response) {
              dispatch({
                  type: REGISTER_USER_SUCCESS,
              })
              if(callback)
                callback();

          })
          .catch(function (error) {
              let errorMessage = "Something went wrong";

              if(error.response.data) {
                errorMessage = error.response.data.errors[0];
              }

              dispatch({ 
                type: REGISTER_USER_FAIL, 
                payload: error.response.data.errors[0]
               });
          });
  }
}

export const loginUser = ({email, password}, callback) => {
  return (dispatch) => {

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    
    
    var params = `username=${email}&password=${password}&grant_type=password&scope=openid offline_access profile`;
    return axios.post(`${AUTH_SERVER_URL}/connect/token`, encodeURI(params))
      .then(function (response) {
        
        
        
        localStorage.setItem('accessToken', response.data.access_token);
        
        localStorage.setItem('refreshToken', response.data.refresh_token);
        localStorage.setItem('idToken', response.data.id_token);
        
        const now = new Date();
        let expirationDate = new Date(now.getTime() + response.data.expires_in * 1000)
                              .getTime().toString();
        localStorage.setItem('expiresAt', expirationDate);
        


        dispatch({
          type: LOGIN_USER_SUCCESS,
          });
          
        dispatch(
          {
              type: FETCH_TOKEN, 
              payload: { 
                token: response.data.access_token, 
                user: getUser(response.data.id_token)
              }
          });

        if(callback)
          callback();
      })
      .catch(function (arg) {
              let errorMessage = "Something went wrong";
                          
              if(arg.response && arg.response.data) {
                errorMessage = arg.response.data.error_description;
              }

              dispatch({ 
                type: LOGIN_USER_FAIL, 
                payload: errorMessage
               });
      })

  }
}


const getUser = (idToken) => {
  let user = {
    fullname: '***',
    username:'***'
  };

  if (idToken) {
    var decoded = jwt_decode(idToken);
    user.username = decoded.name;
  }

  return user;

}
