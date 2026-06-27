import { useEffect } from 'react';
import AppShell from '../components/AppShell';
import Avatar from '../components/Avatar';
import Loading from '../components/Loading';
import MaterialIcon from '../components/MaterialIcon';
import { fetchLeaderboards } from '../states/forumSlice';
import { useAppDispatch, useAppSelector } from '../states/hooks';
import { formatScore } from '../utils';

function LeaderboardPage() {
  const dispatch = useAppDispatch();
  const { leaderboards, leaderboardStatus, error } = useAppSelector((state) => state.forum);

  useEffect(() => {
    void dispatch(fetchLeaderboards());
  }, [dispatch]);

  const topThree = leaderboards.slice(0, 3);

  return (
    <AppShell active="leaderboard">
      <section className="leaderboard-page">
        <header className="page-heading page-heading--center">
          <div>
            <h1>Leaderboards</h1>
            <p>Top contributors in the community.</p>
          </div>
        </header>

        {leaderboardStatus === 'loading' && !leaderboards.length && <Loading label="Loading leaderboard..." />}
        {error && <p className="notice notice--error">{error}</p>}

        <section className="podium-grid" aria-label="Top three contributors">
          {topThree.map((entry, index) => (
            <article className={`podium-card ${index === 0 ? 'podium-card--first' : ''}`} key={entry.user.id}>
              <span className="rank-pill">#{index + 1}</span>
              {index === 0 && <MaterialIcon name="workspace_premium" />}
              <Avatar name={entry.user.name} src={entry.user.avatar} size={index === 0 ? 'xl' : 'lg'} />
              <h2>{entry.user.name}</h2>
              <strong>{formatScore(entry.score)} pts</strong>
            </article>
          ))}
        </section>

        <section className="leaderboard-table-wrap">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Email</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboards.map((entry, index) => (
                <tr key={entry.user.id}>
                  <td>#{index + 1}</td>
                  <td>
                    <div className="table-user">
                      <Avatar name={entry.user.name} src={entry.user.avatar} size="sm" />
                      <strong>{entry.user.name}</strong>
                    </div>
                  </td>
                  <td>{entry.user.email}</td>
                  <td>{formatScore(entry.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {leaderboardStatus !== 'loading' && leaderboards.length === 0 && (
            <div className="empty-state">
              <MaterialIcon name="leaderboard" />
              <h2>No leaderboard data</h2>
              <p>Scores will appear when members start voting and contributing.</p>
            </div>
          )}
        </section>
      </section>
    </AppShell>
  );
}

export default LeaderboardPage;
