import { describe, expect, it } from 'vitest';
import forumReducer, {
  addComment,
  clearForumError,
  fetchHomeData,
  voteThread,
  type ForumState,
} from './forumSlice';
import { authUser, sampleComment, sampleDetailThread, sampleLeaderboards, sampleThread, secondUser } from '../test/fixtures';
import type { Thread } from '../types/forum';

function createThread(overrides: Partial<Thread> = {}): Thread {
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
    ...overrides,
  };
}

function createForumState(overrides: Partial<ForumState> = {}): ForumState {
  return {
    users: [authUser, secondUser],
    threads: [createThread()],
    detailThread: {
      ...sampleDetailThread,
      upVotesBy: [...sampleDetailThread.upVotesBy],
      downVotesBy: [...sampleDetailThread.downVotesBy],
      comments: sampleDetailThread.comments.map((comment) => ({
        ...comment,
        upVotesBy: [...comment.upVotesBy],
        downVotesBy: [...comment.downVotesBy],
      })),
    },
    leaderboards: sampleLeaderboards,
    status: 'idle',
    detailStatus: 'succeeded',
    leaderboardStatus: 'idle',
    mutationStatus: 'idle',
    error: 'Old forum error',
    ...overrides,
  };
}

describe('forum reducer', () => {
  /*
   * Skenario pengujian:
   * 1. Membersihkan error forum tanpa mengubah data lain.
   * 2. Menyimpan data home ketika fetchHomeData fulfilled.
   * 3. Menerapkan optimistic vote thread pada list dan detail.
   * 4. Mengembalikan vote sebelumnya ketika vote thread gagal.
   * 5. Menyamakan jumlah komentar thread setelah komentar baru berhasil ditambahkan.
   */
  it('clears forum error without removing loaded data', () => {
    const state = createForumState();

    const nextState = forumReducer(state, clearForumError());

    expect(nextState.error).toBeNull();
    expect(nextState.threads).toHaveLength(1);
    expect(nextState.detailThread?.id).toBe(sampleThread.id);
  });

  it('stores home data and marks the request as succeeded', () => {
    const thread = createThread({ id: 'thread-new', title: 'Thread terbaru' });

    const nextState = forumReducer(
      createForumState({ status: 'loading', users: [], threads: [], leaderboards: [] }),
      fetchHomeData.fulfilled(
        {
          users: [authUser],
          threads: [thread],
          leaderboards: sampleLeaderboards,
        },
        'request-1',
      ),
    );

    expect(nextState.status).toBe('succeeded');
    expect(nextState.users).toEqual([authUser]);
    expect(nextState.threads).toEqual([thread]);
    expect(nextState.leaderboards).toEqual(sampleLeaderboards);
  });

  it('applies optimistic thread votes to thread list and detail thread', () => {
    const state = createForumState();

    const nextState = forumReducer(
      state,
      voteThread.pending('request-1', {
        threadId: sampleThread.id,
        userId: authUser.id,
        voteType: -1,
        previousVoteType: 1,
      }),
    );

    expect(nextState.threads[0].upVotesBy).not.toContain(authUser.id);
    expect(nextState.threads[0].downVotesBy).toContain(authUser.id);
    expect(nextState.detailThread?.upVotesBy).not.toContain(authUser.id);
    expect(nextState.detailThread?.downVotesBy).toContain(authUser.id);
    expect(nextState.error).toBeNull();
  });

  it('restores the previous thread vote when the vote request is rejected', () => {
    const state = createForumState({
      threads: [
        createThread({
          upVotesBy: ['user-3'],
          downVotesBy: [authUser.id],
        }),
      ],
      detailThread: {
        ...sampleDetailThread,
        upVotesBy: ['user-3'],
        downVotesBy: [authUser.id],
      },
    });

    const nextState = forumReducer(
      state,
      voteThread.rejected(new Error('Network offline'), 'request-1', {
        threadId: sampleThread.id,
        userId: authUser.id,
        voteType: -1,
        previousVoteType: 1,
      }),
    );

    expect(nextState.threads[0].upVotesBy).toContain(authUser.id);
    expect(nextState.threads[0].downVotesBy).not.toContain(authUser.id);
    expect(nextState.detailThread?.upVotesBy).toContain(authUser.id);
    expect(nextState.detailThread?.downVotesBy).not.toContain(authUser.id);
    expect(nextState.error).toBe('Network offline');
  });

  it('replaces detail thread and updates total comments after adding a comment', () => {
    const nextComment = {
      ...sampleComment,
      id: 'comment-2',
      content: '<p>Balasan tambahan.</p>',
      upVotesBy: [],
      downVotesBy: [],
    };
    const detailThread = {
      ...sampleDetailThread,
      comments: [sampleComment, nextComment],
    };

    const nextState = forumReducer(
      createForumState({ mutationStatus: 'loading' }),
      addComment.fulfilled(detailThread, 'request-1', {
        threadId: sampleThread.id,
        content: 'Balasan tambahan.',
      }),
    );

    expect(nextState.mutationStatus).toBe('succeeded');
    expect(nextState.detailThread?.comments).toHaveLength(2);
    expect(nextState.threads[0].totalComments).toBe(2);
  });
});
