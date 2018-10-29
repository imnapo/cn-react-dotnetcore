import { 
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS
 } from "../actions/Types";

 const INITIAL_STATE = {
 }

 export default(state = INITIAL_STATE, action) => {
   switch(action.type) {
     case REGISTER_USER_SUCCESS:
     return { ...state, ...INITIAL_STATE};
     case REGISTER_USER_FAIL:
     return { ...state, ...INITIAL_STATE};
     default: return state;
   }
 }
