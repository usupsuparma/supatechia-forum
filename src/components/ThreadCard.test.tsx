import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ThreadCard from './ThreadCard';
import { authUser, sampleThread } from '../test/fixtures';

describe('ThreadCard component', () => {
  /*
   * Skenario pengujian:
   * 1. Merender metadata thread, kategori, jumlah komentar, dan preview body tanpa HTML.
   * 2. Mengarahkan link judul menuju halaman detail thread.
   * 3. Meneruskan vote thread dengan thread id dan previous vote.
   */
  it('renders thread content and detail link', () => {
    render(
      <MemoryRouter>
        <ThreadCard authUserId={authUser.id} thread={sampleThread} onVote={vi.fn()} />
      </MemoryRouter>,
    );

    const titleLink = screen.getByRole('link', { name: sampleThread.title });

    expect(screen.getByText(sampleThread.owner?.name ?? '')).toBeInTheDocument();
    expect(screen.getByText(`#${sampleThread.category}`)).toBeInTheDocument();
    expect(screen.getByText('Bagaimana cara menyusun komponen agar mudah diuji?')).toBeInTheDocument();
    expect(screen.getByText(`${sampleThread.totalComments} Comments`)).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', `/threads/${sampleThread.id}`);
  });

  it('passes thread id, next vote, and previous vote to onVote', async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();
    render(
      <MemoryRouter>
        <ThreadCard authUserId={authUser.id} thread={sampleThread} onVote={onVote} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Down vote' }));

    expect(onVote).toHaveBeenCalledWith(sampleThread.id, -1, 1);
  });
});
