import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import VoteControls from './VoteControls';

const meta = {
  title: 'Forum/VoteControls',
  component: VoteControls,
  args: {
    authUserId: 'user-1',
    upVotesBy: ['user-1', 'user-2', 'user-3'],
    downVotesBy: ['user-4'],
    onVote: fn(),
  },
} satisfies Meta<typeof VoteControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ActiveUpvote: Story = {};

export const CompactHorizontal: Story = {
  args: {
    orientation: 'horizontal',
    compact: true,
    upVotesBy: ['user-2'],
    downVotesBy: ['user-1', 'user-3'],
  },
};
