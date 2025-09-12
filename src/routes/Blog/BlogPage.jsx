import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../utils/firebase/firebase.utils'
import { Link } from 'react-router-dom';

import './BlogPage.styles.scss'

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})))
    });
    return () => unsubscribe();
  },[])
  
  return (
    <div className='blog-list'>
      <h1 className='blog-list-title'>Blog</h1>
      <div className='blog-list-items'>
      {posts.map(post => (
        <div key={post.id} className='blog-list-item'>
          <h2>{post.title}</h2>
          <p>{post.author} - {post.createdAt?.toDate().toLocaleDateString()}</p>
          <p>{post.content.slice(0, 200)}...</p>
          <Link to={`/blog/${post.id}`}>Read More</Link>
        </div>
      ))}
      </div>
    </div>
  )
}

export default BlogPage