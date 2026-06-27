/**
 * @TODO: Define all the actions (creator) for the talks state
 */
import api from '../../utils/api';
const ActionType = {
  RECEIVE_TALKS: 'RECEIVE_TALKS',
  ADD_TALK: 'ADD_TALK',
  TOGGLE_LIKE_TALK: 'TOGGLE_LIKE_TALK',
};

function receiveTalksActionCreator(talks) {
  return {
    type: ActionType.RECEIVE_TALKS,
    payload: {
      talks,
    },
  };
}

function addTalkActionCreator(talk) {
  return {
    type: ActionType.ADD_TALK,
    payload: {
      talk,
    },
  };
}

function toggleLikeTalkActionCreator(talkId, userId) {
  return {
    type: ActionType.TOGGLE_LIKE_TALK,
    payload: {
      talkId,
      userId,
    },
  };
}

function asyncAddTalk({ title, body, category }) {
  return async (dispatch) => {
    try {
      const talk = await api.createTalk({ title, body, category });
      dispatch(addTalkActionCreator(talk));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncToggleLikeTalk(talkId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(toggleLikeTalkActionCreator(talkId, authUser.id));
    try {
      await api.toggleLikeTalk(talkId);
    } catch (error) {
      alert(error.message);
      dispatch(toggleLikeTalkActionCreator(talkId, authUser.id));
    }
  };
}

export { ActionType, receiveTalksActionCreator, addTalkActionCreator, toggleLikeTalkActionCreator, asyncAddTalk, asyncToggleLikeTalk };