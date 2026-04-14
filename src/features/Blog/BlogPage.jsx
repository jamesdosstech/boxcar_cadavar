import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import { Link } from "react-router-dom";
import "./BlogPage.styles.scss";

const excerpt = (text = "", max = 220) =>
  text.length > max ? text.slice(0, max).trimEnd() + "…" : text;

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const hasPosts = useMemo(() => posts && posts.length > 0, [posts]);

  return (
    <div className="blog-list">
      <div className="blog-list-head">
        <h1>Blog</h1>
        <p className="muted">Updates, drops, show notes, and more.</p>
      </div>

      {loading ? (
        <div className="blog-list-state">Loading posts…</div>
      ) : !hasPosts ? (
        <div className="blog-list-state">No posts yet.</div>
      ) : (
        <div className="blog-list-items">
          {posts.map((post) => {
            const dateText = post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleDateString()
              : "";

            return (
              <article key={post.id} className="blog-card">
                <div className="blog-card-meta">
                  <span className="blog-pill">Post</span>
                  <span className="blog-dot">•</span>
                  <span className="blog-date">{dateText}</span>
                </div>

                <h2 className="blog-card-title">
                  <Link className="blog-card-link" to={`/blog/${post.id}`}>
                    {post.title || "Untitled"}
                  </Link>
                </h2>

                <div className="blog-card-sub">
                  <span className="blog-author">{post.author || "Doosetrain"}</span>
                </div>

                <p className="blog-card-excerpt">
                  {excerpt(post.content || "", 260)}
                </p>

                <div className="blog-card-actions">
                  <Link className="btn ghost" to={`/blog/${post.id}`}>
                    Read more
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
