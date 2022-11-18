import { useReducer } from 'react';
import { commentReducer } from '../../reducers/comment.reducer';

import './comments.styles.scss'

const Comments = ({ comments }) => {
    const [state, dispatch] = useReducer(commentReducer, {
        "showComments": false,
        "comments": comments
    })

    const handleInputKeyUp = (ev) => {
        //Press enter key
        if(ev.code === "Enter") {
            dispatch(
                {
                    type: "ADD_COMMENTS",
                    payload: ev.currentTarget.value
                }
            )
        }
    }

    if (!state.showComments) {
        return (
            <div>
                <h1>Comments</h1>
                <div
                    className='btn'
                    onClick={() => dispatch({
                        type: "COMMENTS_LOADED"
                    })}
                >
                    Load Comments
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Comments</h1>
                <div>
                    {state.comments.map(commentItem => (
                        <div 
                            key={commentItem.id}
                            className="comment"
                            style={{display: "flex", justifyContent: "space-between"}}
                        >
                            <div 
                                className="comment__text"
                                style={{
                                        fontSize: "10px",
                                        align: "left"
                                    }}
                            >
                                {commentItem.text}
                            </div>
                            <div 
                                className="comment__delete-btn"
                                onClick={() => dispatch({
                                    type: "REMOVE_COMMENT",
                                    payload: commentItem.id
                                })}
                                style={{fontSize: "6px"}}
                            >
                                Delete
                            </div>
                        </div>
                    ))}
                </div>
                <div className="comment__new">
                    <input 
                        className="comment__new-input"
                        type="text"
                        placeholder="Your comment"
                        onKeyUp={handleInputKeyUp}
                    />
                </div>
            </div>
        )
    }
}

export default Comments