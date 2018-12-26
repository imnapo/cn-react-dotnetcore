import { 
  REGISTER_USER_START,
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS,
  FETCH_TOKEN,
  LOGIN_USER_START,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER
 } from "../actions/Types";

 const INITIAL_STATE = {
   register_error: '',
   isLoading: false,
   user: null,
   isLogin: null,
   login_error: ''
 }

 export default(state = INITIAL_STATE, action) => {
   switch(action.type) {
      case REGISTER_USER_START:
        return { ...state, isLoading: true, register_error: ''};
      case REGISTER_USER_SUCCESS:
        return { ...state, isLoading: false, register_error: ''};
      case REGISTER_USER_FAIL:
        return { ...state, isLoading: false, register_error: action.payload};
      case LOGIN_USER_START:
        return { ...state, isLoading: true, login_error: ''};
      case  FETCH_TOKEN:     
        return { ...state,           
          isLogin: true,
          user: action.payload
        };
      case LOGIN_USER_SUCCESS:
        return { ...state, isLoading: false, isLogin:true, login_error: ''};
      case LOGIN_USER_FAIL:      
        return { ...state, login_error:action.payload , isLoading: false, isLogin: false, password:'' }
      case LOGOUT_USER:          
        return { ...INITIAL_STATE, isLogin: false};
        break;
      default: return state;
   }
 }
