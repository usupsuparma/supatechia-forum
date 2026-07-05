import type { Comment, DetailThread, Leaderboard, ThreadWithOwner, User } from '../types/forum';

export const authUser: User = {
  id: 'user-1',
  name: 'Supatechia Member',
  email: 'member@example.com',
  avatar: 'https://example.com/member.png',
};

export const secondUser: User = {
  id: 'user-2',
  name: 'Dicoding Reviewer',
  email: 'reviewer@example.com',
  avatar: 'https://example.com/reviewer.png',
};

export const sampleThread: ThreadWithOwner = {
  id: 'thread-1',
  title: 'Strategi belajar React yang rapi',
  body: '<p>Bagaimana cara menyusun komponen agar mudah diuji?</p>',
  category: 'react',
  createdAt: '2026-07-01T09:00:00.000Z',
  ownerId: secondUser.id,
  owner: secondUser,
  upVotesBy: [authUser.id, 'user-3'],
  downVotesBy: ['user-4'],
  totalComments: 7,
};

export const sampleComment: Comment = {
  id: 'comment-1',
  content: '<p>Mulai dari state kecil, lalu uji interaksinya.</p>',
  createdAt: '2026-07-02T10:00:00.000Z',
  owner: {
    id: secondUser.id,
    name: secondUser.name,
    avatar: secondUser.avatar,
  },
  upVotesBy: [authUser.id],
  downVotesBy: [],
};

export const sampleDetailThread: DetailThread = {
  id: sampleThread.id,
  title: sampleThread.title,
  body: sampleThread.body,
  category: sampleThread.category,
  createdAt: sampleThread.createdAt,
  owner: {
    id: secondUser.id,
    name: secondUser.name,
    avatar: secondUser.avatar,
  },
  upVotesBy: sampleThread.upVotesBy,
  downVotesBy: sampleThread.downVotesBy,
  comments: [sampleComment],
};

export const sampleLeaderboards: Leaderboard[] = [
  {
    user: authUser,
    score: 120,
  },
  {
    user: secondUser,
    score: 95,
  },
];
