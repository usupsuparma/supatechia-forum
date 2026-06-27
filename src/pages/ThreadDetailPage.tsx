import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Avatar from '../components/Avatar';
import CommentCard from '../components/CommentCard';
import Loading from '../components/Loading';
import MaterialIcon from '../components/MaterialIcon';
import VoteControls from '../components/VoteControls';
import { addComment, clearDetailThread, fetchThreadDetail, voteComment, voteThread } from '../states/forumSlice';
import { useAppDispatch, useAppSelector } from '../states/hooks';
import { postedAt, sanitizeHtml, scoreFromVotes } from '../utils';
import type { VoteType } from '../types/forum';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const [commentContent, setCommentContent] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { detailThread, detailStatus, mutationStatus, error } = useAppSelector((state) => state.forum);
  const authUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!threadId) {
      return undefined;
    }

    void dispatch(fetchThreadDetail(threadId));

    return () => {
      dispatch(clearDetailThread());
    };
  }, [dispatch, threadId]);

  const handleThreadVote = useCallback((voteType: VoteType, previousVoteType: VoteType) => {
    if (detailThread?.id && authUser?.id) {
      void dispatch(voteThread({ threadId: detailThread.id, voteType, previousVoteType, userId: authUser.id }));
    }
  }, [authUser, detailThread, dispatch]);

  const handleCommentVote = useCallback((commentId: string, voteType: VoteType, previousVoteType: VoteType) => {
    if (detailThread?.id && authUser?.id) {
      void dispatch(voteComment({ threadId: detailThread.id, commentId, voteType, previousVoteType, userId: authUser.id }));
    }
  }, [authUser, detailThread, dispatch]);

  async function handleSubmitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!detailThread || !commentContent.trim()) {
      return;
    }

    try {
      await dispatch(addComment({ threadId: detailThread.id, content: commentContent.trim() })).unwrap();
      setCommentContent('');
    } catch (requestError) {
      setLocalError(getErrorMessage(requestError, 'Unable to post comment'));
    }
  }

  if (!threadId) {
    return <Navigate replace to="/" />;
  }

  return (
    <AppShell active="detail">
      <section className="detail-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Discussions</Link>
          <MaterialIcon name="chevron_right" />
          <span>{detailThread?.category ?? 'Thread Detail'}</span>
        </nav>

        {detailStatus === 'loading' && !detailThread && <Loading label="Loading thread detail..." />}
        {(localError || error) && <p className="notice notice--error">{localError || error}</p>}

        {detailThread && (
          <div className="detail-layout">
            <article className="detail-card">
              <header className="detail-card__header">
                <span className="tag">#{detailThread.category || 'General'}</span>
                <h1>{detailThread.title}</h1>
                <div className="detail-card__meta">
                  <Avatar name={detailThread.owner.name} src={detailThread.owner.avatar} size="md" />
                  <div>
                    <strong>{detailThread.owner.name}</strong>
                    <span>{postedAt(detailThread.createdAt)}</span>
                  </div>
                  <VoteControls
                    upVotesBy={detailThread.upVotesBy}
                    downVotesBy={detailThread.downVotesBy}
                    authUserId={authUser?.id}
                    onVote={handleThreadVote}
                    orientation="horizontal"
                  />
                </div>
              </header>

              <div className="prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(detailThread.body) }} />
            </article>

            <section className="comments-section">
              <div className="comments-section__heading">
                <h2>Replies ({detailThread.comments.length})</h2>
              </div>

              <form className="comment-form" onSubmit={handleSubmitComment}>
                <textarea
                  onChange={(event) => setCommentContent(event.target.value)}
                  placeholder="Write a thoughtful reply..."
                  required
                  value={commentContent}
                />
                <div className="comment-form__footer">
                  <div aria-hidden="true">
                    <MaterialIcon name="format_bold" />
                    <MaterialIcon name="format_italic" />
                    <MaterialIcon name="link" />
                    <MaterialIcon name="code" />
                  </div>
                  <button className="button button--primary" disabled={mutationStatus === 'loading'} type="submit">
                    {mutationStatus === 'loading' ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>

              <div className="comment-list">
                {detailThread.comments.map((comment) => (
                  <CommentCard
                    authUserId={authUser?.id}
                    comment={comment}
                    key={comment.id}
                    onVote={handleCommentVote}
                  />
                ))}
              </div>
            </section>

            <aside className="detail-sidebar">
              <section className="panel">
                <h2>About the Author</h2>
                <div className="stat-row">
                  <span>Thread Score</span>
                  <strong>{scoreFromVotes(detailThread.upVotesBy, detailThread.downVotesBy)}</strong>
                </div>
                <div className="stat-row">
                  <span>Replies</span>
                  <strong>{detailThread.comments.length}</strong>
                </div>
                <div className="stat-row">
                  <span>Category</span>
                  <strong>{detailThread.category || 'General'}</strong>
                </div>
              </section>

              <section className="promo-panel">
                <h2>Supatechia Forum</h2>
                <p>Share what you learned, ask sharp questions, and keep the discussion generous.</p>
              </section>
            </aside>
          </div>
        )}
      </section>
    </AppShell>
  );
}

export default ThreadDetailPage;
