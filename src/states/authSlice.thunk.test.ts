import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../utils/api';
import authReducer, { loginUser, preloadAuth, registerUser } from './authSlice';
import { authUser, secondUser } from '../test/fixtures';

vi.mock('../utils/api', () => ({
  default: {
    getAccessToken: vi.fn(),
    putAccessToken: vi.fn(),
    removeAccessToken: vi.fn(),
    getOwnProfile: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
}));

function createAuthStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
}

describe('auth thunks', () => {
  /*
   * Skenario pengujian:
   * 1. preloadAuth tidak memanggil profil ketika token tidak tersedia.
   * 2. loginUser memanggil API login, menyimpan token, dan mengambil profil pengguna.
   * 3. registerUser mengembalikan user hasil registrasi dan mengubah registerStatus.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preloadAuth returns null when there is no access token', async () => {
    vi.mocked(api.getAccessToken).mockReturnValue(null);
    const store = createAuthStore();

    const action = await store.dispatch(preloadAuth());

    expect(action.type).toBe(preloadAuth.fulfilled.type);
    expect(action.payload).toBeNull();
    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(store.getState().auth.initialized).toBe(true);
  });

  it('loginUser stores token and loads the authenticated profile', async () => {
    vi.mocked(api.login).mockResolvedValue('token-123');
    vi.mocked(api.getOwnProfile).mockResolvedValue(authUser);
    const store = createAuthStore();

    const action = await store.dispatch(
      loginUser({
        email: 'member@example.com',
        password: 'secret123',
      }),
    );

    expect(action.type).toBe(loginUser.fulfilled.type);
    expect(api.login).toHaveBeenCalledWith({
      email: 'member@example.com',
      password: 'secret123',
    });
    expect(api.putAccessToken).toHaveBeenCalledWith('token-123');
    expect(api.getOwnProfile).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.user).toEqual(authUser);
  });

  it('registerUser resolves registered user and marks register status as succeeded', async () => {
    vi.mocked(api.register).mockResolvedValue(secondUser);
    const store = createAuthStore();

    const action = await store.dispatch(
      registerUser({
        name: secondUser.name,
        email: secondUser.email,
        password: 'secret123',
      }),
    );

    expect(action.type).toBe(registerUser.fulfilled.type);
    expect(action.payload).toEqual(secondUser);
    expect(api.register).toHaveBeenCalledWith({
      name: secondUser.name,
      email: secondUser.email,
      password: 'secret123',
    });
    expect(store.getState().auth.registerStatus).toBe('succeeded');
  });
});
