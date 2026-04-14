import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { db } from "../../../utils/firebase/firebase.utils";
import { doc, getDoc } from "firebase/firestore";
import "./BlogPost.styles.scss";

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;
        const docRef = doc(db, "blogPosts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPost(docSnap.data());
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return <div className="blog-container">Loading…</div>;
  if (!post) return <div className="blog-container">Post not found.</div>;

  const dateText = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString()
    : "";

  return (
    <article className="blog-container">
      <NavLink className="blog-back" to="/blog">
        ← Back
      </NavLink>

      <header className="blog-header">
        <h1>{post.title}</h1>
        <div className="blog-meta">
          <span>{post.author || "Doosetrain"}</span>
          {dateText ? <span className="dot">•</span> : null}
          {dateText ? <span>{dateText}</span> : null}
        </div>
      </header>

      <div className="blog-content">{post.content || ""}</div>
    </article>
  );
};

export default BlogPost;
