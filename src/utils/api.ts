import type {
  Comment,
  CreateThreadPayload,
  DetailThread,
  Leaderboard,
  LoginPayload,
  RegisterPayload,
  Thread,
  User,
  Vote,
  VoteType,
} from '../types/forum';

const BASE_URL = 'https://forum-api.dicoding.dev/v1';
const ACCESS_TOKEN_KEY = 'accessToken';

type ApiEnvelope<T> = {
  status: string;
  message: string;
  data?: T;
};

type RegisterResponse = {
  user: User;
};

type LoginResponse = {
  token: string;
};

type UsersResponse = {
  users: User[];
};

type OwnProfileResponse = {
  user?: User;
  users?: User[];
};

type ThreadsResponse = {
  threads: Thread[];
};

type ThreadResponse = {
  thread: Thread;
};

type DetailThreadResponse = {
  detailThread: DetailThread;
};

type CommentResponse = {
  comment: Comment;
};

type VoteResponse = {
  vote: Vote;
};

type LeaderboardsResponse = {
  leaderboards: Leaderboard[];
};

function putAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const responseJson = (await response
    .json()
    .catch(() => ({ status: 'fail', message: response.statusText }))) as ApiEnvelope<T>;

  if (!response.ok || responseJson.status !== 'success') {
    throw new Error(responseJson.message || 'Request failed');
  }

  if (!responseJson.data) {
    throw new Error('Response data is empty');
  }

  return responseJson.data;
}

async function register(payload: RegisterPayload) {
  const data = await request<RegisterResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data.user;
}

async function login(payload: LoginPayload) {
  const data = await request<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data.token;
}

async function getOwnProfile() {
  const data = await request<OwnProfileResponse>('/users/me');

  if (data.user) {
    return data.user;
  }

  if (data.users?.[0]) {
    return data.users[0];
  }

  throw new Error('Profile data is empty');
}

async function getAllUsers() {
  const data = await request<UsersResponse>('/users');
  return data.users;
}

async function getAllThreads() {
  const data = await request<ThreadsResponse>('/threads');
  return data.threads;
}

async function createThread(payload: CreateThreadPayload) {
  const data = await request<ThreadResponse>('/threads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data.thread;
}

async function getThreadDetail(threadId: string) {
  const data = await request<DetailThreadResponse>(`/threads/${threadId}`);
  return data.detailThread;
}

async function createComment(threadId: string, content: string) {
  const data = await request<CommentResponse>(`/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });

  return data.comment;
}

async function voteThread(threadId: string, voteType: VoteType) {
  const action = voteType === 1 ? 'up-vote' : voteType === -1 ? 'down-vote' : 'neutral-vote';
  const data = await request<VoteResponse>(`/threads/${threadId}/${action}`, {
    method: 'POST',
  });

  return data.vote;
}

async function voteComment(threadId: string, commentId: string, voteType: VoteType) {
  const action = voteType === 1 ? 'up-vote' : voteType === -1 ? 'down-vote' : 'neutral-vote';
  const data = await request<VoteResponse>(`/threads/${threadId}/comments/${commentId}/${action}`, {
    method: 'POST',
  });

  return data.vote;
}

async function getLeaderboards() {
  const data = await request<LeaderboardsResponse>('/leaderboards');
  return data.leaderboards;
}

const api = {
  putAccessToken,
  getAccessToken,
  removeAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  createThread,
  getThreadDetail,
  createComment,
  voteThread,
  voteComment,
  getLeaderboards,
};

export default api;
