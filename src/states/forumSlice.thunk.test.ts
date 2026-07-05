import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../utils/api';
import forumReducer, { addComment, fetchHomeData, voteThread } from './forumSlice';
import { authUser, sampleDetailThread, sampleLeaderboards, sampleThread, secondUser } from '../test/fixtures';
import type { Thread } from '../types/forum';

vi.mock('../utils/api', () => ({
  default: {
    getAllUsers: vi.fn(),
    getAllThreads: vi.fn(),
    getLeaderboards: vi.fn(),
    createComment: vi.fn(),
    getThreadDetail: vi.fn(),
    voteThread: vi.fn(),
  },
}));

function createThread(): Thread {
  return {
    id: sampleThread.id,
    title: sampleThread.title,
    body: sampleThread.body,
    category: sampleThread.category,
    createdAt: sampleThread.createdAt,
    ownerId: sampleThread.ownerId,
    upVotesBy: [...sampleThread.upVotesBy],
    downVotesBy: [...sampleThread.downVotesBy],
    totalComments: sampleThread.totalComments,
  };
}

function createForumStore() {
  return configureStore({
    reducer: {
      forum: forumReducer,
    },
  });
}

describe('forum thunks', () => {
  /*
   * Skenario pengujian:
   * 1. fetchHomeData mengambil users, threads, dan leaderboards secara bersamaan.
   * 2. addComment membuat komentar lalu memuat ulang detail thread.
   * 3. voteThread memakai respons API untuk payload vote final.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchHomeData loads users, threads, and leaderboards into the store', async () => {
    const thread = createThread();
    vi.mocked(api.getAllUsers).mockResolvedValue([authUser, secondUser]);
    vi.mocked(api.getAllThreads).mockResolvedValue([thread]);
    vi.mocked(api.getLeaderboards).mockResolvedValue(sampleLeaderboards);
    const store = createForumStore();

    const action = await store.dispatch(fetchHomeData());

    expect(action.type).toBe(fetchHomeData.fulfilled.type);
    expect(api.getAllUsers).toHaveBeenCalledTimes(1);
    expect(api.getAllThreads).toHaveBeenCalledTimes(1);
    expect(api.getLeaderboards).toHaveBeenCalledTimes(1);
    expect(store.getState().forum.users).toEqual([authUser, secondUser]);
    expect(store.getState().forum.threads).toEqual([thread]);
    expect(store.getState().forum.leaderboards).toEqual(sampleLeaderboards);
  });

  it('addComment posts comment content and reloads detail thread', async () => {
    vi.mocked(api.createComment).mockResolvedValue(sampleDetailThread.comments[0]);
    vi.mocked(api.getThreadDetail).mockResolvedValue(sampleDetailThread);
    const store = createForumStore();

    const action = await store.dispatch(
      addComment({
        threadId: sampleThread.id,
        content: 'Komentar baru',
      }),
    );

    expect(action.type).toBe(addComment.fulfilled.type);
    expect(api.createComment).toHaveBeenCalledWith(sampleThread.id, 'Komentar baru');
    expect(api.getThreadDetail).toHaveBeenCalledWith(sampleThread.id);
    expect(store.getState().forum.detailThread).toEqual(sampleDetailThread);
  });

  it('voteThread resolves the API vote as final thunk payload', async () => {
    vi.mocked(api.voteThread).mockResolvedValue({
      id: 'vote-1',
      threadId: sampleThread.id,
      userId: authUser.id,
      voteType: 0,
    });
    const store = createForumStore();

    const action = await store.dispatch(
      voteThread({
        threadId: sampleThread.id,
        userId: authUser.id,
        voteType: -1,
        previousVoteType: 1,
      }),
    );

    expect(action.type).toBe(voteThread.fulfilled.type);
    expect(action.payload).toEqual({
      threadId: sampleThread.id,
      userId: authUser.id,
      voteType: 0,
    });
    expect(api.voteThread).toHaveBeenCalledWith(sampleThread.id, -1);
  });
});
