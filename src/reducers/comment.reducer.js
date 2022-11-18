export const commentReducer = (state, action) => {
    switch(action.type) {
        case 'COMMENTS_LOADED':
            return { "showComments": true, "comments": state.comments}
        case 'ADD_COMMENTS':
            // copy the current states comments
            const comments = [...state.comments];
            //push the comments 
            comments.push({id:state.comments[state.comments.length - 1].id + 1, text: action.payload});
            //return the updated state
            return { "showComments": true, "comments": comments }
        case 'REMOVE_COMMENT':
            const commentsWithoutDeleted = state.comments.filter(comment => comment.id !== action.payload);
            // return updated state
            return { "showComments": true, "comments": commentsWithoutDeleted }
        default:
            throw new Error();
    }
}