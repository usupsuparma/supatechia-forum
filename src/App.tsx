import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import Loading from './components/Loading';
import { preloadAuth } from './states/authSlice';
import { useAppDispatch, useAppSelector } from './states/hooks';
import CreateThreadPage from './pages/CreateThreadPage';
import DashboardPage from './pages/DashboardPage';
import HelpPage from './pages/HelpPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import PrivacyPage from './pages/PrivacyPage';
import RegisterPage from './pages/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage';

type RouteGuardProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: RouteGuardProps) {
  const authUser = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!authUser) {
    return <Navigate replace state={{ from: `${location.pathname}${location.search}` }} to="/login" />;
  }

  return children;
}

function PublicRoute({ children }: RouteGuardProps) {
  const authUser = useAppSelector((state) => state.auth.user);

  if (authUser) {
    return <Navigate replace to="/" />;
  }

  return children;
}

function App() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);

  useEffect(() => {
    void dispatch(preloadAuth());
  }, [dispatch]);

  if (!initialized) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
        path="/"
      />
      <Route
        element={
          <ProtectedRoute>
            <CreateThreadPage />
          </ProtectedRoute>
        }
        path="/threads/new"
      />
      <Route
        element={
          <ProtectedRoute>
            <ThreadDetailPage />
          </ProtectedRoute>
        }
        path="/threads/:threadId"
      />
      <Route
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        }
        path="/leaderboard"
      />
      <Route
        element={
          <ProtectedRoute>
            <HelpPage />
          </ProtectedRoute>
        }
        path="/help"
      />
      <Route
        element={
          <ProtectedRoute>
            <PrivacyPage />
          </ProtectedRoute>
        }
        path="/privacy"
      />
      <Route
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
        path="/login"
      />
      <Route
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
        path="/register"
      />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default App;
