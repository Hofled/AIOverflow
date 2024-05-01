import { UPDATE_USERNAME, UPDATE_ID, IdentityActionTypes } from "./actions";

export interface IdentityState {
  username?: string;
  id?: number;
}

const initialState: IdentityState = {
  username: loadUserName(),
  id: loadUserId(),
};

function loadUserName(): string | undefined {
  const userName = localStorage.getItem("userName");
  return userName ? userName : undefined;
}

function loadUserId(): number | undefined {
  const userId = localStorage.getItem("userId");
  return userId ? parseInt(userId, 10) : undefined;
}

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
