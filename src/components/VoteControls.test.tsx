import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import VoteControls from './VoteControls';

describe('VoteControls component', () => {
  /*
   * Skenario pengujian:
   * 1. Menampilkan skor dari selisih up vote dan down vote.
   * 2. Menandai tombol vote yang sedang aktif untuk user.
   * 3. Mengirim neutral vote ketika user menekan ulang vote aktif.
   * 4. Mengirim down vote beserta previous vote ketika user mengganti pilihan.
   */
  it('renders score and active upvote state', () => {
    render(
      <VoteControls
        authUserId="user-1"
        upVotesBy={['user-1', 'user-2', 'user-3']}
        downVotesBy={['user-4']}
        onVote={vi.fn()}
      />,
    );

    expect(screen.getByTitle('3 up votes, 1 down votes')).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: 'Up vote' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Down vote' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('sends neutral vote when active vote button is clicked again', async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();
    render(<VoteControls authUserId="user-1" upVotesBy={['user-1']} downVotesBy={[]} onVote={onVote} />);

    await user.click(screen.getByRole('button', { name: 'Up vote' }));

    expect(onVote).toHaveBeenCalledWith(0, 1);
  });

  it('sends new downvote and previous vote when user changes vote', async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();
    render(<VoteControls authUserId="user-1" upVotesBy={['user-1']} downVotesBy={[]} onVote={onVote} />);

    await user.click(screen.getByRole('button', { name: 'Down vote' }));

    expect(onVote).toHaveBeenCalledWith(-1, 1);
  });
});
