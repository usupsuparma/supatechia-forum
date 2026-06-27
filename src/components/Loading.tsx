type LoadingProps = {
  label?: string;
};

function Loading({ label = 'Loading Supatechia Forum...' }: LoadingProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-state__spinner material-symbols-outlined" aria-hidden="true">
        sync
      </span>
      <span>{label}</span>
    </div>
  );
}

export default Loading;
