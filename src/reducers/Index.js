import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import AuthReducer from './AuthReducer';
const rootReducer = combineReducers({
form,
auth: AuthReducer,
});

export default rootReducer;
