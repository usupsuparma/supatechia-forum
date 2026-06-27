import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import MaterialIcon from './MaterialIcon';
import VoteControls from './VoteControls';
import { postedAt, stripHtml } from '../utils';
import type { ThreadWithOwner, VoteType } from '../types/forum';

type ThreadCardProps = {
  thread: ThreadWithOwner;
  authUserId?: string;
  onVote: (threadId: string, voteType: VoteType, previousVoteType: VoteType) => void;
};

function ThreadCard({ thread, authUserId, onVote }: ThreadCardProps) {
  const ownerName = thread.owner?.name ?? 'Supatechia Member';
  const ownerAvatar = thread.owner?.avatar;
  const bodyPreview = stripHtml(thread.body);
  const handleVote = useCallback(
    (voteType: VoteType, previousVoteType: VoteType) => {
      onVote(thread.id, voteType, previousVoteType);
    },
    [onVote, thread.id],
  );

  return (
    <article className="thread-card">
      <VoteControls
        upVotesBy={thread.upVotesBy}
        downVotesBy={thread.downVotesBy}
        authUserId={authUserId}
        onVote={handleVote}
      />

      <div className="thread-card__content">
        <div className="thread-card__meta">
          <Avatar name={ownerName} src={ownerAvatar} size="xs" />
          <strong>{ownerName}</strong>
          <span>{postedAt(thread.createdAt)}</span>
          <span className="tag">#{thread.category || 'General'}</span>
        </div>

        <h2 className="thread-card__title">
          <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
        </h2>

        <p className="thread-card__body">{bodyPreview}</p>

        <div className="thread-card__footer">
          <span>
            <MaterialIcon name="forum" />
            {thread.totalComments} Comments
          </span>
          <Link to={`/threads/${thread.id}`}>
            <MaterialIcon name="open_in_new" />
            Open Thread
          </Link>
        </div>
      </div>
    </article>
  );
}

export default memo(ThreadCard);
