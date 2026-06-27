import api from '../../utils/api';
import { setAuthUserActionCreator } from '../authUser/action';

/**
 * @TODO: Define all the actions (creator) for the isPreLoad state
 */
const ActionType = {
  SET_IS_PRELOAD: 'SET_IS_PRELOAD',
};

function setIsPreloadActionCreator(isPayload) {
  return {
    type: ActionType.SET_IS_PRELOAD,
    payload: {
      isPayload,
    },
  };
}

function asyncPreloadProcess() {
  return async (dispatch) => {
    try {
      // preload process
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser));
    } catch {
      // fallback error
      dispatch(setAuthUserActionCreator(null));
    } finally {
      // end preload process
      dispatch(setIsPreloadActionCreator(false));
    }
  };
}

export { ActionType, setIsPreloadActionCreator, asyncPreloadProcess };
