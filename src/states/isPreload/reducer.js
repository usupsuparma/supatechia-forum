/**
 * @TODO: Define reducer for the isPreLoad state
 */
import { ActionType } from './action';

function isPreloadReducer(isPreload = true, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_PRELOAD:
      return action.payload.isPayload;
    default:
      return isPreload;
  }
}

export default isPreloadReducer;