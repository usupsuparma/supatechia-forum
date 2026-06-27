import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Avatar from './Avatar';
import MaterialIcon from './MaterialIcon';
import { logoutUser } from '../states/authSlice';
import { useAppDispatch, useAppSelector } from '../states/hooks';

type AppShellProps = {
  children: ReactNode;
  active?: 'home' | 'leaderboard' | 'create' | 'detail' | 'help' | 'privacy';
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

function AppShell({ children, active = 'home', searchValue, onSearchChange }: AppShellProps) {
  const authUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canSearch = typeof onSearchChange === 'function';

  async function handleLogout() {
    await dispatch(logoutUser()).unwrap();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="topbar__brand-group">
            <Link className="brand" to="/">
              <MaterialIcon name="forum" />
              <span>Supatechia Forum</span>
            </Link>
            {canSearch && (
              <label className="search-field topbar__search">
                <MaterialIcon name="search" />
                <input
                  value={searchValue ?? ''}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search discussions..."
                  type="search"
                />
              </label>
            )}
          </div>

          <nav className="topbar__links" aria-label="Primary navigation">
            <NavLink className={({ isActive }) => `topbar__link ${isActive ? 'is-active' : ''}`} to="/" end>
              Discussions
            </NavLink>
            <NavLink className={({ isActive }) => `topbar__link ${isActive ? 'is-active' : ''}`} to="/leaderboard">
              Members
            </NavLink>
          </nav>

          <div className="topbar__actions">
            <Link className="button button--primary topbar__create" to="/threads/new">
              <MaterialIcon name="add" />
              <span>Create Thread</span>
            </Link>
            <button className="icon-button" type="button" title="Notifications" aria-label="Notifications">
              <MaterialIcon name="notifications" />
            </button>
            <button className="icon-button" type="button" title="Messages" aria-label="Messages">
              <MaterialIcon name="mail" />
            </button>
            {authUser && <Avatar name={authUser.name} src={authUser.avatar} size="sm" />}
            <button className="icon-button" type="button" title="Sign out" aria-label="Sign out" onClick={handleLogout}>
              <MaterialIcon name="logout" />
            </button>
          </div>
        </div>
      </header>

      <div className="app-shell__body">
        <aside className="sidebar" aria-label="Forum navigation">
          <div className="sidebar__brand">
            <div className="sidebar__logo">
              <MaterialIcon name="hub" />
            </div>
            <div>
              <strong>Supatechia</strong>
              <span>Community Hub</span>
            </div>
          </div>

          <nav className="sidebar__nav">
            <NavLink className={({ isActive }) => `sidebar__link ${isActive || active === 'home' ? 'is-active' : ''}`} to="/" end>
              <MaterialIcon name="home" />
              <span>Home</span>
            </NavLink>
            <NavLink className={({ isActive }) => `sidebar__link ${isActive || active === 'leaderboard' ? 'is-active' : ''}`} to="/leaderboard">
              <MaterialIcon name="leaderboard" />
              <span>Leaderboard</span>
            </NavLink>
            <Link className={`sidebar__link ${active === 'create' ? 'is-active' : ''}`} to="/threads/new">
              <MaterialIcon name="edit_square" />
              <span>New Thread</span>
            </Link>
            <Link className="sidebar__link" to="/">
              <MaterialIcon name="schedule" />
              <span>Latest</span>
            </Link>
          </nav>

          <div className="sidebar__footer">
            <NavLink className={({ isActive }) => `sidebar__link ${isActive || active === 'help' ? 'is-active' : ''}`} to="/help">
              <MaterialIcon name="help_outline" />
              <span>Help</span>
            </NavLink>
            <NavLink className={({ isActive }) => `sidebar__link ${isActive || active === 'privacy' ? 'is-active' : ''}`} to="/privacy">
              <MaterialIcon name="policy" />
              <span>Privacy</span>
            </NavLink>
          </div>
        </aside>

        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
