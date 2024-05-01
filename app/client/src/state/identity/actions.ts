export const UPDATE_USERNAME = 'UPDATE_USERNAME';
export const UPDATE_ID = 'UPDATE_ID';

export const updateUsername = (newUsername?: string): UpdateUsernameAction => ({
  type: UPDATE_USERNAME,
  payload: newUsername,
});

export const updateId = (newId?: number): UpdateIdAction => ({
  type: UPDATE_ID,
  payload: newId,
});

export interface UpdateUsernameAction {
  type: typeof UPDATE_USERNAME;
  payload?: string;
}

export interface UpdateIdAction {
  type: typeof UPDATE_ID;
  payload?: number;
}

export type IdentityActionTypes = UpdateUsernameAction | UpdateIdAction;