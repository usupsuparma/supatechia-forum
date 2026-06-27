import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/api';
import type {
  CreateThreadPayload,
  DetailThread,
  Leaderboard,
  Thread,
  User,
  Vote,
  VoteType,
} from '../types/forum';

type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type Votable = {
  upVotesBy: string[];
  downVotesBy: string[];
};

type ForumState = {
  users: User[];
  threads: Thread[];
  detailThread: DetailThread | null;
  leaderboards: Leaderboard[];
  status: AsyncStatus;
  detailStatus: AsyncStatus;
  leaderboardStatus: AsyncStatus;
  mutationStatus: AsyncStatus;
  error: string | null;
};

type ThreadVotePayload = {
  threadId: string;
  userId: string;
  voteType: VoteType;
  previousVoteType: VoteType;
};

type CommentVotePayload = ThreadVotePayload & {
  commentId: string;
};

const initialState: ForumState = {
  users: [],
  threads: [],
  detailThread: null,
  leaderboards: [],
  status: 'idle',
  detailStatus: 'idle',
  leaderboardStatus: 'idle',
  mutationStatus: 'idle',
  error: null,
};

function setVote(target: Votable, userId: string, voteType: VoteType) {
  target.upVotesBy = target.upVotesBy.filter((id) => id !== userId);
  target.downVotesBy = target.downVotesBy.filter((id) => id !== userId);

  if (voteType === 1) {
    target.upVotesBy.push(userId);
  }

  if (voteType === -1) {
    target.downVotesBy.push(userId);
  }
}

function getVoteType(vote: Vote, fallback: VoteType) {
  return vote.voteType === 1 || vote.voteType === -1 || vote.voteType === 0 ? vote.voteType : fallback;
}

function applyThreadVote(state: ForumState, threadId: string, userId: string, voteType: VoteType) {
  const thread = state.threads.find((item) => item.id === threadId);

  if (thread) {
    setVote(thread, userId, voteType);
  }

  if (state.detailThread?.id === threadId) {
    setVote(state.detailThread, userId, voteType);
  }
}

function applyCommentVote(state: ForumState, commentId: string, userId: string, voteType: VoteType) {
  const comment = state.detailThread?.comments.find((item) => item.id === commentId);

  if (comment) {
    setVote(comment, userId, voteType);
  }
}

export const fetchHomeData = createAsyncThunk('forum/fetchHomeData', async () => {
  const [users, threads, leaderboards] = await Promise.all([
    api.getAllUsers(),
    api.getAllThreads(),
    api.getLeaderboards(),
  ]);

  return { users, threads, leaderboards };
});

export const fetchLeaderboards = createAsyncThunk('forum/fetchLeaderboards', async () => {
  return api.getLeaderboards();
});

export const fetchThreadDetail = createAsyncThunk('forum/fetchThreadDetail', async (threadId: string) => {
  return api.getThreadDetail(threadId);
});

export const createNewThread = createAsyncThunk('forum/createThread', async (payload: CreateThreadPayload) => {
  return api.createThread(payload);
});

export const addComment = createAsyncThunk(
  'forum/addComment',
  async ({ threadId, content }: { threadId: string; content: string }) => {
    await api.createComment(threadId, content);
    return api.getThreadDetail(threadId);
  },
);

export const voteThread = createAsyncThunk(
  'forum/voteThread',
  async ({ threadId, voteType, userId }: ThreadVotePayload) => {
    const vote = await api.voteThread(threadId, voteType);
    return { threadId, userId: vote.userId || userId, voteType: getVoteType(vote, voteType) };
  },
);

export const voteComment = createAsyncThunk(
  'forum/voteComment',
  async ({ threadId, commentId, voteType, userId }: CommentVotePayload) => {
    const vote = await api.voteComment(threadId, commentId, voteType);
    return { threadId, commentId, userId: vote.userId || userId, voteType: getVoteType(vote, voteType) };
  },
);

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    clearForumError(state) {
      state.error = null;
    },
    clearDetailThread(state) {
      state.detailThread = null;
      state.detailStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.threads = action.payload.threads;
        state.leaderboards = action.payload.leaderboards;
        state.status = 'succeeded';
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load forum data';
      })
      .addCase(fetchLeaderboards.pending, (state) => {
        state.leaderboardStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.leaderboards = action.payload;
        state.leaderboardStatus = 'succeeded';
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.leaderboardStatus = 'failed';
        state.error = action.error.message ?? 'Failed to load leaderboard';
      })
      .addCase(fetchThreadDetail.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.detailThread = action.payload;
        state.detailStatus = 'succeeded';
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.detailThread = null;
        state.detailStatus = 'failed';
        state.error = action.error.message ?? 'Failed to load thread';
      })
      .addCase(createNewThread.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createNewThread.fulfilled, (state, action) => {
        state.threads.unshift(action.payload);
        state.mutationStatus = 'succeeded';
      })
      .addCase(createNewThread.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.error.message ?? 'Failed to create thread';
      })
      .addCase(addComment.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.detailThread = action.payload;
        state.mutationStatus = 'succeeded';

        const thread = state.threads.find((item) => item.id === action.payload.id);
        if (thread) {
          thread.totalComments = action.payload.comments.length;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.error.message ?? 'Failed to add comment';
      })
      .addCase(voteThread.pending, (state, action) => {
        const { threadId, userId, voteType } = action.meta.arg;
        state.error = null;
        applyThreadVote(state, threadId, userId, voteType);
      })
      .addCase(voteThread.fulfilled, (state, action) => {
        const { threadId, userId, voteType } = action.payload;
        applyThreadVote(state, threadId, userId, voteType);
      })
      .addCase(voteThread.rejected, (state, action) => {
        const { threadId, userId, previousVoteType } = action.meta.arg;
        applyThreadVote(state, threadId, userId, previousVoteType);
        state.error = action.error.message ?? 'Failed to vote thread';
      })
      .addCase(voteComment.pending, (state, action) => {
        const { commentId, userId, voteType } = action.meta.arg;
        state.error = null;
        applyCommentVote(state, commentId, userId, voteType);
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        const { commentId, userId, voteType } = action.payload;
        applyCommentVote(state, commentId, userId, voteType);
      })
      .addCase(voteComment.rejected, (state, action) => {
        const { commentId, userId, previousVoteType } = action.meta.arg;
        applyCommentVote(state, commentId, userId, previousVoteType);
        state.error = action.error.message ?? 'Failed to vote comment';
      });
  },
});

export const { clearDetailThread, clearForumError } = forumSlice.actions;
export type { ForumState };
export default forumSlice.reducer;
