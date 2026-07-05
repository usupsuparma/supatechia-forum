import { describe, expect, it } from 'vitest';
import authReducer, { clearAuthError, loginUser, logoutUser, type AuthState } from './authSlice';
import { authUser } from '../test/fixtures';

function createAuthState(overrides: Partial<AuthState> = {}): AuthState {
  return {
    user: null,
    initialized: true,
    status: 'idle',
    registerStatus: 'idle',
    error: 'Old auth error',
    ...overrides,
  };
}

describe('auth reducer', () => {
  /*
   * Skenario pengujian:
   * 1. Membersihkan error autentikasi dari state.
   * 2. Menandai proses login sebagai loading.
   * 3. Menyimpan user ketika login fulfilled.
   * 4. Menghapus user dan menampilkan error ketika login rejected.
   * 5. Mengosongkan user ketika logout fulfilled.
   */
  it('clears auth error', () => {
    const nextState = authReducer(createAuthState(), clearAuthError());

    expect(nextState.error).toBeNull();
  });

  it('sets loading status and clears error when login starts', () => {
    const nextState = authReducer(
      createAuthState(),
      loginUser.pending('request-1', {
        email: 'member@example.com',
        password: 'secret123',
      }),
    );

    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  it('stores authenticated user when login succeeds', () => {
    const nextState = authReducer(
      createAuthState({ initialized: false, status: 'loading' }),
      loginUser.fulfilled(authUser, 'request-1', {
        email: 'member@example.com',
        password: 'secret123',
      }),
    );

    expect(nextState.user).toEqual(authUser);
    expect(nextState.initialized).toBe(true);
    expect(nextState.status).toBe('succeeded');
  });

  it('removes user and stores error when login fails', () => {
    const nextState = authReducer(
      createAuthState({ user: authUser, status: 'loading' }),
      loginUser.rejected(new Error('Invalid credentials'), 'request-1', {
        email: 'member@example.com',
        password: 'wrong-password',
      }),
    );

    expect(nextState.user).toBeNull();
    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe('Invalid credentials');
  });

  it('resets user and auth error when logout succeeds', () => {
    const nextState = authReducer(createAuthState({ user: authUser }), logoutUser.fulfilled(undefined, 'request-1'));

    expect(nextState.user).toBeNull();
    expect(nextState.status).toBe('idle');
    expect(nextState.error).toBeNull();
  });
});
