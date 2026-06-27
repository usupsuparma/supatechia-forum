import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import MaterialIcon from '../components/MaterialIcon';
import { clearForumError, createNewThread } from '../states/forumSlice';
import { useAppDispatch, useAppSelector } from '../states/hooks';
import useInput from '../hooks/useInput';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function CreateThreadPage() {
  const [title, onTitleChange] = useInput('');
  const [category, onCategoryChange] = useInput('');
  const [body, onBodyChange] = useInput('');
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutationStatus, error } = useAppSelector((state) => state.forum);
  const disabled = mutationStatus === 'loading';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    dispatch(clearForumError());

    try {
      const thread = await dispatch(
        createNewThread({
          title: title.trim(),
          body: body.trim(),
          category: category.trim() || 'General',
        }),
      ).unwrap();

      navigate(`/threads/${thread.id}`);
    } catch (requestError) {
      setLocalError(getErrorMessage(requestError, 'Unable to create thread'));
    }
  }

  return (
    <AppShell active="create">
      <section className="editor-page">
        <header className="page-heading">
          <div>
            <h1>Create New Thread</h1>
            <p>Start a new discussion. Be descriptive and follow community guidelines.</p>
          </div>
        </header>

        {(localError || error) && <p className="notice notice--error">{localError || error}</p>}

        <form className="editor-card" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Title</span>
            <input onChange={onTitleChange} placeholder="What's on your mind?" required type="text" value={title} />
          </label>

          <label className="form-field">
            <span>Category</span>
            <span className="input-shell">
              <MaterialIcon name="sell" />
              <input
                onChange={onCategoryChange}
                placeholder="e.g., Q&A, Announcements, Development"
                type="text"
                value={category}
              />
            </span>
          </label>

          <label className="form-field">
            <span>Body</span>
            <span className="editor-toolbar" aria-hidden="true">
              <MaterialIcon name="format_bold" />
              <MaterialIcon name="format_italic" />
              <MaterialIcon name="link" />
              <MaterialIcon name="format_quote" />
              <MaterialIcon name="code" />
              <MaterialIcon name="format_list_bulleted" />
            </span>
            <textarea
              className="editor-textarea"
              onChange={onBodyChange}
              placeholder="Write your post content here..."
              required
              value={body}
            />
          </label>

          <div className="form-actions">
            <button className="button button--outline" disabled={disabled} type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="button button--primary" disabled={disabled} type="submit">
              {disabled ? 'Posting...' : 'Post Thread'}
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}

export default CreateThreadPage;
