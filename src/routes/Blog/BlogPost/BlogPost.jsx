import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../../utils/firebase/firebase.utils';
import { doc, getDoc } from 'firebase/firestore';
import './BlogPost.styles.scss'

const BlogPost = () => {
    const {postId} = useParams();
    const [post, setPost] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            const docRef = doc(db, "blogPosts", postId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setPost(docSnap.data());
        };
        fetchPost();
    }, [postId])

    if (!post) return <p>Loading...</p>
  return (
    <div className='blog-container'>
        <h1>{post.title}</h1>
        <p>{post.author} * {post.createdAt?.toDate().toLocaleDateString()}</p>
        <p>{post.content}</p>
    </div>
  );
}

export default BlogPost