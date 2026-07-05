import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import ThreadCard from './ThreadCard';
import { authUser, sampleThread } from '../test/fixtures';

const meta = {
  title: 'Forum/ThreadCard',
  component: ThreadCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    authUserId: authUser.id,
    thread: sampleThread,
    onVote: fn(),
  },
} satisfies Meta<typeof ThreadCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutOwner: Story = {
  args: {
    thread: {
      ...sampleThread,
      owner: undefined,
      upVotesBy: [],
      downVotesBy: [],
    },
  },
};
