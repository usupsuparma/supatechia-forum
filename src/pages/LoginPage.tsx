import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MaterialIcon from '../components/MaterialIcon';
import { clearAuthError, loginUser } from '../states/authSlice';
import { useAppDispatch, useAppSelector } from '../states/hooks';
import useInput from '../hooks/useInput';

type LoginLocationState = {
  from?: string;
  notice?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function LoginPage() {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);
  const state = location.state as LoginLocationState | null;
  const error = localError || auth.error;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    dispatch(clearAuthError());

    try {
      await dispatch(loginUser({ email: email.trim(), password })).unwrap();
      navigate(state?.from ?? '/', { replace: true });
    } catch (requestError) {
      setLocalError(getErrorMessage(requestError, 'Unable to sign in'));
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Supatechia Forum">
        <div className="auth-hero__brand">
          <MaterialIcon name="hub" />
          <h1>Supatechia Forum</h1>
        </div>
        <p>Access the community hub for knowledge-centric discussions and orderly collaboration.</p>
      </section>

      <section className="auth-card" aria-labelledby="login-title">
        <header>
          <h2 id="login-title">Welcome Back</h2>
          <p>Please enter your details to sign in.</p>
        </header>

        {state?.notice && <p className="notice notice--success">{state.notice}</p>}
        {error && <p className="notice notice--error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email Address</span>
            <span className="input-shell">
              <MaterialIcon name="mail" />
              <input
                autoComplete="email"
                onChange={onEmailChange}
                placeholder="name@company.com"
                required
                type="email"
                value={email}
              />
            </span>
          </label>

          <label className="form-field">
            <span>Password</span>
            <span className="input-shell">
              <MaterialIcon name="lock" />
              <input
                autoComplete="current-password"
                minLength={6}
                onChange={onPasswordChange}
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                className="icon-button input-shell__action"
                type="button"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((current) => !current)}
              >
                <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} />
              </button>
            </span>
          </label>

          <label className="check-row">
            <input type="checkbox" />
            <span>Remember me for 30 days</span>
          </label>

          <button className="button button--primary button--block" disabled={auth.status === 'loading'} type="submit">
            {auth.status === 'loading' ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <footer className="auth-card__footer">
          <p>
            New to the community? <Link to="/register">Create an account</Link>
          </p>
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;
