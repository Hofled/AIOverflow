import { combineReducers } from 'redux';
import identityReducer, { IdentityState } from './identity/reducer';

export interface AppState {
    identity: IdentityState;
}

const rootReducer = combineReducers({
    identity: identityReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;