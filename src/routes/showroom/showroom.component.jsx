import './showroom.styles.scss';

import ImageIcon from '../../components/image-icon/image-icon.component'
import { Link } from 'react-router-dom';

import Comments from '../../components/comments/comments.component';

import StreamContainer from '../../components/stream-container/stream-container.component'

import Button from '../../components/button/button.component';

const Showroom = () => {
    const Title = 'Showroom';

    const initialComments = [
        {
            id: 1,
            text: "this is the first comment"
        },
        {
            id: 2,
            text: "this is another comment"
        },
    ]

    return (
        <div className="App">
            <h1>{Title}</h1>
            <ImageIcon />
            <div style={{display: "flex",justifyContent: "space-evenly"}}>
                <StreamContainer />
                <Comments comments={initialComments}/>
            </div>    
            <div>
                <Link to='/'>
                    <Button>back</Button>
                </Link>
            </div>        
        </div>
    )
}

export default Showroom