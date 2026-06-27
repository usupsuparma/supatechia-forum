import { memo } from 'react';
import { initials } from '../utils';

type AvatarProps = {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const className = `avatar avatar--${size}`;

  if (src) {
    return <img className={className} src={src} alt={name} title={name} />;
  }

  return (
    <span className={`${className} avatar--fallback`} title={name}>
      {initials(name)}
    </span>
  );
}

export default memo(Avatar);
