import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../../../utils/firebase/firebase.utils";

const BlogEdit = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "blogPosts", postId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTitle(data.title);
        setContent(data.content);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "blogPosts", postId);
    await updateDoc(docRef, {
      title,
      content,
    });
    navigate(`/admin/blog/${postId}`);
  };

  return (
    <form className="form-container" onSubmit={handleUpdate}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button className="nav-link" type="submit">Update Post</button>
    </form>
  );
};

export default BlogEdit;
