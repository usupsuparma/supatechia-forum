import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CommentCard from './CommentCard';
import { authUser, sampleComment } from '../test/fixtures';

describe('CommentCard component', () => {
  /*
   * Skenario pengujian:
   * 1. Merender nama pemilik dan isi komentar yang sudah disanitasi.
   * 2. Menghapus script dan atribut event handler dari HTML komentar.
   * 3. Meneruskan vote komentar dengan comment id dan previous vote.
   */
  it('renders sanitized comment content', () => {
    const { container } = render(
      <CommentCard
        authUserId={authUser.id}
        comment={{
          ...sampleComment,
          content: '<p>Komentar aman</p><script>alert("xss")</script><img src="x" onerror="alert(1)">',
        }}
        onVote={vi.fn()}
      />,
    );

    expect(screen.getByText(sampleComment.owner.name)).toBeInTheDocument();
    expect(screen.getByText('Komentar aman')).toBeInTheDocument();
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('img')?.getAttribute('onerror')).toBeNull();
  });

  it('passes comment id, next vote, and previous vote to onVote', async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();
    render(<CommentCard authUserId={authUser.id} comment={sampleComment} onVote={onVote} />);

    await user.click(screen.getByRole('button', { name: 'Down vote' }));

    expect(onVote).toHaveBeenCalledWith(sampleComment.id, -1, 1);
  });
});
