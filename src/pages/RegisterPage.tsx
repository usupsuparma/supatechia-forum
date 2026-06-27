import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MaterialIcon from '../components/MaterialIcon';
import { clearAuthError, registerUser } from '../states/authSlice';
import { useAppDispatch, useAppSelector } from '../states/hooks';
import useInput from '../hooks/useInput';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function RegisterPage() {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const error = localError || auth.error;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    dispatch(clearAuthError());

    try {
      await dispatch(registerUser({ name: name.trim(), email: email.trim(), password })).unwrap();
      navigate('/login', {
        replace: true,
        state: { notice: 'Registration successful. Please sign in.' },
      });
    } catch (requestError) {
      setLocalError(getErrorMessage(requestError, 'Unable to create account'));
    }
  }

  return (
    <main className="auth-page auth-page--pattern">
      <section className="auth-card auth-card--register" aria-labelledby="register-title">
        <div className="auth-card__brand">
          <div className="auth-card__icon">
            <MaterialIcon name="forum" />
          </div>
          <h1 id="register-title">Supatechia Forum</h1>
          <p>Join our community of knowledge seekers and industry experts.</p>
        </div>

        {error && <p className="notice notice--error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Full Name</span>
            <span className="input-shell">
              <MaterialIcon name="person" />
              <input
                autoComplete="name"
                onChange={onNameChange}
                placeholder="Enter your full name"
                required
                type="text"
                value={name}
              />
            </span>
          </label>

          <label className="form-field">
            <span>Email Address</span>
            <span className="input-shell">
              <MaterialIcon name="mail" />
              <input
                autoComplete="email"
                onChange={onEmailChange}
                placeholder="name@supatechia.com"
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
                autoComplete="new-password"
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
            <small>At least 6 characters.</small>
          </label>

          <label className="check-row">
            <input required type="checkbox" />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>

          <button className="button button--primary button--block" disabled={auth.registerStatus === 'loading'} type="submit">
            <span>{auth.registerStatus === 'loading' ? 'Creating...' : 'Register'}</span>
            <MaterialIcon name="arrow_forward" />
          </button>
        </form>

        <footer className="auth-card__footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </footer>
      </section>
    </main>
  );
}

export default RegisterPage;
