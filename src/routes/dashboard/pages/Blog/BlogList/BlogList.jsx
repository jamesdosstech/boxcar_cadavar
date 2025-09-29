import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/firebase/firebase.utils';
import { NavLink } from 'react-router-dom';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, 'blogPosts'));
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData)
    }

  useEffect(() => {
    fetchPosts()
  },[]);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, "blogPosts", postId));
      fetchPosts(); // Refresh the list
    }
  };

  return (
    <div>
      <h2>All Blog Entries</h2>
      <ul>
        {posts.map((post) => (
          <li style={{textDecoration: 'none', paddingBottom: '1rem', display: 'flex'}}>
            <NavLink to={`/admin/blog/${post.id}`}>{post.title}</NavLink>
            <NavLink to={`/admin/blog/${post.id}/edit`}>Edit</NavLink>
            <button className='nav-link' onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList