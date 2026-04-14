import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./BlogList.styles.scss";
import type { BlogPost } from "../blog.types";
import { deleteBlogPost, getAllBlogPosts } from "../../../../../utils/firebase/firebase.utils";

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (e) {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteBlogPost(postId);
    fetchPosts();
  };

  return (
    <div className="ds-admin-card">
      <div className="ds-admin-card-header">
        <h3 className="ds-admin-card-title">All Blog Posts</h3>
        <p className="ds-admin-card-subtitle">{posts.length} total</p>
      </div>

      {loading && <p style={{ opacity: 0.85 }}>Loading…</p>}
      {!loading && error && <p className="ds-error">{error}</p>}

      {!loading && !error && (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Created</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ opacity: 0.8 }}>
                    No posts yet.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <NavLink to={`/admin/blog/${p.id}`} className="ds-link">
                        {p.title || "(untitled)"}
                      </NavLink>
                    </td>
                    <td style={{ opacity: 0.9 }}>{p.author || "—"}</td>
                    <td style={{ opacity: 0.85 }}>
                      {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : "—"}
                    </td>
                    <td className="ds-row-actions">
                      <NavLink to={`/admin/blog/${p.id}/edit`} className="ds-btn ds-btn-sm ds-btn-ghost">
                        Edit
                      </NavLink>
                      <button className="ds-btn ds-btn-sm" type="button" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
