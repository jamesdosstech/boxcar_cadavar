import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./BlogDetails.styles.scss";
import type { BlogPost } from "../blog.types";
import { deleteBlogPost, getBlogPost } from "../../../../../utils/firebase/firebase.utils";

export default function BlogDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;

    let cancelled = false;

    const run = async () => {
      setError("");
      setLoading(true);
      try {
        const data = await getBlogPost(postId);
        if (!cancelled) setPost(data);
      } catch (e) {
        if (!cancelled) setError("Post not found.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleDelete = async () => {
    if (!postId) return;
    if (!window.confirm("Delete this post?")) return;
    await deleteBlogPost(postId);
    navigate("/admin/blog");
  };

  if (loading) return <p style={{ opacity: 0.85 }}>Loading…</p>;
  if (error) return <p className="ds-error">{error}</p>;
  if (!post) return null;

  return (
    <div className="ds-admin-card">
      <div className="ds-admin-card-header">
        <div>
          <h3 className="ds-admin-card-title">{post.title}</h3>
          <p className="ds-admin-card-subtitle">
            {post.author || "—"} •{" "}
            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : "—"}
          </p>
        </div>

        <div className="ds-row-actions">
          <NavLink to={`/admin/blog/${post.id}/edit`} className="ds-btn ds-btn-sm ds-btn-ghost">
            Edit
          </NavLink>
          <button className="ds-btn ds-btn-sm" type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="ds-prose">
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{post.content}</pre>
      </div>
    </div>
  );
}
