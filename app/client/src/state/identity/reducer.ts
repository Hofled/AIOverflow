import { UPDATE_USERNAME, UPDATE_ID, IdentityActionTypes } from "./actions";

export interface IdentityState {
  username?: string;
  id?: number;
}

const initialState: IdentityState = {
  username: undefined,
  id: undefined,
};

const identityReducer = (state: IdentityState = initialState, action: IdentityActionTypes): IdentityState => {
  switch (action.type) {
    case UPDATE_USERNAME:
      return {
        ...state,
        username: action.payload,
      };
    case UPDATE_ID:
      return {
        ...state,
        id: action.payload,
      };
    default:
      return state;
  }
};

export default identityReducer;
