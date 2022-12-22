import { useContext } from 'react';
import { Link } from 'react-router-dom';

import './showroom.styles.scss';

import ImageIcon from '../../components/image-icon/image-icon.component'


import StreamContainer from '../../components/stream-container/stream-container.component';
import CommentContainer from '../../components/comment-container/comment-container.component'

import Button from '../../components/button/button.component';

import { UserContext } from '../../context/user/user.context';

const Showroom = () => {
    const Title = 'Showroom';
    const { currentUser } = useContext(UserContext)

    // const initialComments = [
    //     {
    //         id: 1,
    //         text: "this is the first comment"
    //     },
    //     {
    //         id: 2,
    //         text: "this is another comment"
    //     },
    // ]

    return (
        <div className="App">
            <ImageIcon />
            <div className='showroom-container'>                
                <StreamContainer />
                {/* <CommentContainer currentUser={currentUser} /> */}
                {
                    currentUser ? (
                        <CommentContainer currentUser={currentUser}/>
                    ) : (
                        <>
                        <CommentContainer currentUser={null}/>
                        {/* <Button ><Link to='/sign-in'>Sign In</Link></Button> */}
                        </>
                    )
                }
                {/* <Comments comments={initialComments}/> */}              
            </div>          
        </div>
    )
}

export default Showroom