import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../../utils/firebase/firebase.utils";
import "../BlogEdit/BlogForm.styles.scss"; // ✅ shared between BlogEntry + BlogEdit

type BlogPostInput = {
  title: string;
  content: string;
  author: string;
};

export default function BlogEntry() {
  const navigate = useNavigate();

  const titleId = useId();
  const contentId = useId();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Doosetrain Team");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload: BlogPostInput = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || "Doosetrain Team",
    };

    if (!payload.title) return setError("Title is required.");
    if (!payload.content) return setError("Content is required.");

    setIsSaving(true);
    try {
      const ref = await addDoc(collection(db, "blogPosts"), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // ✅ go to details page after create
      navigate(`/admin/blog/${ref.id}`);
    } catch (err) {
      setError("Failed to create blog post.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit} aria-label="Create blog post">
      <header className="ds-form-header">
        <h3 className="ds-form-title">New blog post</h3>
        <p className="ds-form-subtitle">Write your post and publish it to the site.</p>
      </header>

      {error && (
        <p className="ds-error" role="alert">
          {error}
        </p>
      )}

      <div className="ds-form-grid">
        <div className="ds-field">
          <label className="ds-label" htmlFor={titleId}>
            Title
          </label>
          <input
            id={titleId}
            className="ds-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title…"
            autoComplete="off"
            required
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            className="ds-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Doosetrain Team"
            autoComplete="organization"
          />
        </div>

        <div className="ds-field-full">
          <label className="ds-label" htmlFor={contentId}>
            Content
          </label>
          <textarea
            id={contentId}
            className="ds-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something…"
            rows={10}
            required
          />
        </div>
      </div>

      <div className="ds-form-actions">
        <button className="ds-btn" type="submit" disabled={isSaving}>
          {isSaving ? "Publishing…" : "Publish Post"}
        </button>

        <button
          className="ds-btn ds-btn-ghost"
          type="button"
          onClick={() => navigate("/admin/blog")}
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
