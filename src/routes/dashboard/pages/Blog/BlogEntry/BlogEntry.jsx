import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../../../../../utils/firebase/firebase.utils';
import './BlogEntry.styles.scss'
const BlogEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('All fields required');
    try {
      await addDoc(collection(db, 'blogPosts'), {
        title,
        content,
        createdAt: serverTimestamp(),
        author: "Doosetrain Team"
      });
      setTitle('');
      setContent('');
      alert('Post Added')
    } catch(err) {
      console.error(err);
    }
  }
  return (
    <form className='form-container' onSubmit={handleSubmit}>
      <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
      <textarea placeholder='Content' value={content} onChange={(e) => setContent(e.target.value)}></textarea>
      <button type='submit'>Add Post</button>
    </form>
  )
}

export default BlogEntry