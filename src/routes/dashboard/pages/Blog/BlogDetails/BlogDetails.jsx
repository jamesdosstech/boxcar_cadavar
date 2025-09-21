import React, { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useParams, NavLink, Navigate } from "react-router-dom";
import { db } from "../../../../../utils/firebase/firebase.utils";

const BlogDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "blogPosts", postId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setPost({ id: snapshot.id, ...snapshot.data() });
      }
    };
    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, "blogPosts", postId));
      Navigate("/admin/blog"); // go back to blog list
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="blog-details">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>
        By {post.author} on{" "}
        {post.createdAt?.toDate().toLocaleDateString() || "Unknown"}
      </small>
      <br />
      <div style={{display: 'flex'}}>
        <NavLink to={`/admin/blog/${postId}/edit`}>Edit Post</NavLink>
        <button className="nav-link" onClick={handleDelete}>Delete Post</button>
      </div>
    </div>
  );
};

export default BlogDetails;
