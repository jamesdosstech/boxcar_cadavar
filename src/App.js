import './App.css';
import { useEffect, useState } from 'react';

import CommentItem from './components/comment-item/comment-item.component'

const App = () => {
  const Title = 'Doosetrain';

  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((comments) => {
      console.log(comments);
      setUserComments(comments)
    })
  },[])

  // console.log({userComments});

  return (
    <div className="App">
      <h1>{Title}</h1>
      <input />
      <div>
        <CommentItem userComments={userComments} />
      </div>
      
    </div>
  );
}

export default App;
