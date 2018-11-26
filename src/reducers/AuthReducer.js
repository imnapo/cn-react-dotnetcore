import { 
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS,
  FETCH_TOKEN,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS
 } from "../actions/Types";

 const INITIAL_STATE = {
   register_error: '',
   user: null,
   isLogin: null,
   login_error: '',
   token: undefined
 }

 export default(state = INITIAL_STATE, action) => {
   switch(action.type) {
     case REGISTER_USER_SUCCESS:
     return { ...state, ...INITIAL_STATE};
     case REGISTER_USER_FAIL:
     return { ...state, register_error: action.payload};
     case  FETCH_TOKEN:
            return { ...state, 
              token: action.payload.token, 
              isLogin: true,
              user: action.payload.user
             };
     case LOGIN_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, token: action.payload, isLogin:true };
        case LOGIN_USER_FAIL:      
            return { ...state, login_error:action.payload , isLogin: false, password:'' }
     default: return state;
   }
 }
