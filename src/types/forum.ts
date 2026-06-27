export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type Thread = {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
};

export type ThreadWithOwner = Thread & {
  owner?: User;
};

export type CommentOwner = {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  owner: CommentOwner;
  upVotesBy: string[];
  downVotesBy: string[];
};

export type DetailThread = {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  owner: CommentOwner;
  upVotesBy: string[];
  downVotesBy: string[];
  comments: Comment[];
};

export type Leaderboard = {
  user: User;
  score: number;
};

export type VoteType = -1 | 0 | 1;

export type Vote = {
  id: string;
  userId: string;
  threadId?: string;
  commentId?: string;
  voteType: VoteType;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type CreateThreadPayload = {
  title: string;
  body: string;
  category?: string;
};
