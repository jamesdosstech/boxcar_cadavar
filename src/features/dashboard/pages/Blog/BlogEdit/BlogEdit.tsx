import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BlogForm.styles.scss";
import { getBlogPost, updateBlogPost } from "../../../../../utils/firebase/firebase.utils";

export default function BlogEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;

    let cancelled = false;

    const run = async () => {
      setError("");
      try {
        const p = await getBlogPost(postId);
        if (cancelled) return;
        setTitle(p.title ?? "");
        setContent(p.content ?? "");
      } catch (e) {
        if (!cancelled) setError("Failed to load post.");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    setSaving(true);
    setError("");
    try {
      await updateBlogPost(postId, {
        title: title.trim(),
        content,
      });
      navigate(`/admin/blog/${postId}`);
    } catch (e) {
      setError("Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleUpdate}>
      <header className="ds-form-header">
        <h3>Edit Post</h3>
        <p style={{ margin: 0, opacity: 0.8 }}>Update title and content.</p>
      </header>

      {error && <p className="ds-error">{error}</p>}

      <label className="ds-label">
        Title
        <input className="ds-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="ds-label">
        Content
        <textarea
          className="ds-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
        />
      </label>

      <div className="ds-row">
        <button className="ds-btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Update Post"}
        </button>
      </div>
    </form>
  );
}
