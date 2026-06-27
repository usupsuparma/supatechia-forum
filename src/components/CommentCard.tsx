import { memo, useCallback } from 'react';
import Avatar from './Avatar';
import VoteControls from './VoteControls';
import { postedAt, sanitizeHtml } from '../utils';
import type { Comment, VoteType } from '../types/forum';

type CommentCardProps = {
  comment: Comment;
  authUserId?: string;
  onVote: (commentId: string, voteType: VoteType, previousVoteType: VoteType) => void;
};

function CommentCard({ comment, authUserId, onVote }: CommentCardProps) {
  const handleVote = useCallback(
    (voteType: VoteType, previousVoteType: VoteType) => {
      onVote(comment.id, voteType, previousVoteType);
    },
    [comment.id, onVote],
  );

  return (
    <article className="comment-card">
      <Avatar name={comment.owner.name} src={comment.owner.avatar} size="md" />
      <div className="comment-card__body">
        <header>
          <strong>{comment.owner.name}</strong>
          <span>{postedAt(comment.createdAt)}</span>
        </header>
        <div className="prose prose--comment" dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content) }} />
        <VoteControls
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
          authUserId={authUserId}
          onVote={handleVote}
          orientation="horizontal"
          compact
        />
      </div>
    </article>
  );
}

export default memo(CommentCard);
