import MaterialIcon from './MaterialIcon';
import { scoreFromVotes } from '../utils';
import type { VoteType } from '../types/forum';

type VoteControlsProps = {
  upVotesBy: string[];
  downVotesBy: string[];
  authUserId?: string;
  onVote: (voteType: VoteType) => void;
  orientation?: 'vertical' | 'horizontal';
  compact?: boolean;
};

function VoteControls({
  upVotesBy,
  downVotesBy,
  authUserId,
  onVote,
  orientation = 'vertical',
  compact = false,
}: VoteControlsProps) {
  const currentVote: VoteType = authUserId
    ? upVotesBy.includes(authUserId)
      ? 1
      : downVotesBy.includes(authUserId)
        ? -1
        : 0
    : 0;
  const score = scoreFromVotes(upVotesBy, downVotesBy);

  function handleVote(voteType: VoteType) {
    onVote(currentVote === voteType ? 0 : voteType);
  }

  return (
    <div className={`vote-controls vote-controls--${orientation} ${compact ? 'vote-controls--compact' : ''}`}>
      <button
        type="button"
        className={`icon-button vote-controls__button ${currentVote === 1 ? 'is-active' : ''}`}
        aria-label="Up vote"
        aria-pressed={currentVote === 1}
        title="Up vote"
        onClick={() => handleVote(1)}
      >
        <MaterialIcon name="expand_less" />
      </button>
      <span className="vote-controls__score" title={`${upVotesBy.length} up votes, ${downVotesBy.length} down votes`}>
        {score}
      </span>
      <button
        type="button"
        className={`icon-button vote-controls__button ${currentVote === -1 ? 'is-active is-negative' : ''}`}
        aria-label="Down vote"
        aria-pressed={currentVote === -1}
        title="Down vote"
        onClick={() => handleVote(-1)}
      >
        <MaterialIcon name="expand_more" />
      </button>
    </div>
  );
}

export default VoteControls;
