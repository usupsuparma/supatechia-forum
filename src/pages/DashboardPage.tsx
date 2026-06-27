import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Avatar from '../components/Avatar';
import Loading from '../components/Loading';
import MaterialIcon from '../components/MaterialIcon';
import ThreadCard from '../components/ThreadCard';
import { fetchHomeData, voteThread } from '../states/forumSlice';
import { useAppDispatch, useAppSelector } from '../states/hooks';
import { formatScore, scoreFromVotes } from '../utils';
import type { ThreadWithOwner, VoteType } from '../types/forum';

type SortMode = 'newest' | 'active' | 'rated';

function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const dispatch = useAppDispatch();
  const { users, threads, leaderboards, status, error } = useAppSelector((state) => state.forum);
  const authUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    void dispatch(fetchHomeData());
  }, [dispatch]);

  const threadsWithOwners = useMemo<ThreadWithOwner[]>(() => {
    return threads.map((thread) => ({
      ...thread,
      owner: users.find((user) => user.id === thread.ownerId),
    }));
  }, [threads, users]);

  const categories = useMemo(() => {
    return Array.from(new Set(threads.map((thread) => thread.category).filter(Boolean))).sort();
  }, [threads]);

  const visibleThreads = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return threadsWithOwners
      .filter((thread) => {
        const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory;
        const matchesSearch =
          !normalizedQuery ||
          [thread.title, thread.body, thread.category, thread.owner?.name ?? '']
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesCategory && matchesSearch;
      })
      .sort((left, right) => {
        if (sortMode === 'active') {
          return right.totalComments - left.totalComments;
        }

        if (sortMode === 'rated') {
          return scoreFromVotes(right.upVotesBy, right.downVotesBy) - scoreFromVotes(left.upVotesBy, left.downVotesBy);
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      });
  }, [searchQuery, selectedCategory, sortMode, threadsWithOwners]);

  const trendingThreads = useMemo(() => {
    return [...threadsWithOwners]
      .sort((left, right) => right.totalComments - left.totalComments)
      .slice(0, 3);
  }, [threadsWithOwners]);

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    setSortMode(event.target.value as SortMode);
  }

  function handleVote(threadId: string, voteType: VoteType) {
    void dispatch(voteThread({ threadId, voteType }));
  }

  return (
    <AppShell active="home" searchValue={searchQuery} onSearchChange={setSearchQuery}>
      <div className="dashboard">
        <section className="page-heading">
          <div>
            <h1>Global Discussions</h1>
            <p>Stay updated with the latest in technology and community knowledge.</p>
          </div>
          <label className="select-field">
            <span>Sort by</span>
            <select onChange={handleSortChange} value={sortMode}>
              <option value="newest">Newest First</option>
              <option value="active">Most Active</option>
              <option value="rated">Highest Rated</option>
            </select>
          </label>
        </section>

        <div className="category-strip" aria-label="Thread categories">
          <button
            className={selectedCategory === 'all' ? 'is-active' : ''}
            type="button"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              className={selectedCategory === category ? 'is-active' : ''}
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
            >
              #{category}
            </button>
          ))}
        </div>

        {error && <p className="notice notice--error">{error}</p>}

        <div className="dashboard__grid">
          <section className="thread-list" aria-label="Thread list">
            {status === 'loading' && !threads.length ? (
              <Loading label="Loading discussions..." />
            ) : (
              visibleThreads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} authUserId={authUser?.id} onVote={handleVote} />
              ))
            )}

            {status !== 'loading' && visibleThreads.length === 0 && (
              <div className="empty-state">
                <MaterialIcon name="forum" />
                <h2>No threads found</h2>
                <p>Try another keyword or start a new discussion.</p>
                <Link className="button button--primary" to="/threads/new">
                  <MaterialIcon name="add" />
                  Create Thread
                </Link>
              </div>
            )}
          </section>

          <aside className="dashboard-sidebar" aria-label="Forum summary">
            <section className="panel">
              <h2>
                <MaterialIcon name="trending_up" />
                Trending Topics
              </h2>
              <div className="topic-cloud">
                {categories.slice(0, 8).map((category) => (
                  <button key={category} type="button" onClick={() => setSelectedCategory(category)}>
                    #{category}
                  </button>
                ))}
              </div>
              <div className="mini-list">
                {trendingThreads.map((thread) => (
                  <Link key={thread.id} to={`/threads/${thread.id}`}>
                    <span>{thread.title}</span>
                    <small>{thread.totalComments} comments</small>
                  </Link>
                ))}
              </div>
            </section>

            <section className="panel">
              <h2>
                <MaterialIcon name="leaderboard" />
                Leaderboard
              </h2>
              <div className="leaderboard-mini">
                {leaderboards.slice(0, 5).map((entry, index) => (
                  <div className="leaderboard-mini__row" key={entry.user.id}>
                    <span className="rank-pill">#{index + 1}</span>
                    <Avatar name={entry.user.name} src={entry.user.avatar} size="sm" />
                    <strong>{entry.user.name}</strong>
                    <span>{formatScore(entry.score)} pts</span>
                  </div>
                ))}
              </div>
              <Link className="button button--outline button--block" to="/leaderboard">
                View Full Leaderboard
              </Link>
            </section>

            <section className="promo-panel">
              <h2>Supatechia Forum</h2>
              <p>{threads.length} threads, {users.length} members, and a lot of useful conversations.</p>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

export default DashboardPage;
