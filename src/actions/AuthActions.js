import {
  REGISTER_USER_START,
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_START,
  FETCH_TOKEN
} from './Types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const AUTH_SERVER_URL = '';

 //OpenIddict post header should contain Content-Type
 let header = {
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};


export const registerUser = ({email, password, confirmPassword}, callback) => {
  
  return async (dispatch) => {

    dispatch({
      type: REGISTER_USER_START,
    })

    var params = {
      email, password,confirmPassword
    };

    try {
      const response = await axios.post(`${AUTH_SERVER_URL}/api/auth/register`, params)
      
      dispatch({
        type: REGISTER_USER_SUCCESS,
      })

      if(callback)
        callback();

    } catch (error) {
        let errorMessages = [];
        if(error.response.data.general) {
          Array.prototype.push.apply(errorMessages, error.response.data.general);
        }
        else {
          errorMessages.push('Registration Failed. Something went wrong!')
        }
        
        dispatch({ 
          type: REGISTER_USER_FAIL, 
          payload: errorMessages
          });
    }
          
  }
}

export const loginUser = ({email, password}, callback) => {
 
   return async (dispatch) => {
    dispatch({
      type: LOGIN_USER_START,
    })
    //OpenIddict post parameters should be string as below (Json not allowed)
    var params = `username=${email}&password=${password}&grant_type=password&scope=openid offline_access profile`;
    
    try {
      const response = await axios.post(`${AUTH_SERVER_URL}/connect/token`
      , encodeURI(params), header );
      //Save Tokens local storage.
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
            payload:  getUser(response.data.id_token)
        });

        if(callback)
          callback();

    } catch (arg) {
      let errorMessage = "Something went wrong";
                               
      if(arg.response && arg.response.data) {
        errorMessage = arg.response.data.error_description;
      }

      dispatch({ 
        type: LOGIN_USER_FAIL, 
        payload: errorMessage
        });
    }
  }
}

export function loadThings() {
  return (dispatch, getState) => {

      
      const { auth, isLoading } = getState();

      if(auth.isLogin == null) {
        //dispatch({ type: LOAD_FETCHING, fetching: true })
  
          let accessToken = localStorage.getItem('accessToken');       
          let expiresAt = localStorage.getItem('expiresAt');   

            
            if (!isExpired(expiresAt)) {
              let idToken = localStorage.getItem('idToken');           
                dispatch(
                  {
                    type: FETCH_TOKEN, payload: { user: getUser(idToken)}
                  }
                )              
            }
            else {
              
              refreshToken(dispatch);
            }

          

      }

  };
}

const refreshToken = async (dispatch) => {
let refreshToken = localStorage.getItem('refreshToken');       
  
if(refreshToken) {


  var params = `refresh_token=${refreshToken}&grant_type=refresh_token&scope=openid offline_access profile`;
  try {
    let response = await axios.post(`${AUTH_SERVER_URL}connect/token`, encodeURI(params), header);
    localStorage.setItem('accessToken', response.data.access_token);
    const now = new Date();
    let expirationDate = new Date(now.getTime() + response.data.expires_in * 1000).getTime().toString();

    localStorage.setItem('refreshToken', response.data.refresh_token);
    localStorage.setItem('expiresAt', expirationDate);
    localStorage.setItem('idToken', response.data.id_token);
    
    dispatch(
      {
        type: FETCH_TOKEN, 
        payload: getUser(response.data.id_token)
      }
    )

  } catch (error) {
    
        dispatch({
          type: LOGIN_USER_FAIL
        })
  }

     
  }
  else {
    dispatch({
      type: LOGIN_USER_FAIL
    })
  }


}

const getUser = (idToken) => {
  let user = {
    username:'***'
  };

  if (idToken) {
    var decoded = jwt_decode(idToken);
    user.username = decoded.name;
  }

  return user;

}

const isExpired = (expiresAt) => {
  
  if (Date.now() >= expiresAt) {
      return true;
  }
  else {
    return false;
  }
}
