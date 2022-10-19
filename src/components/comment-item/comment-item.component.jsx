const CommentItem = ({userComments}) => {
    return (
        <div>
            {
                userComments.slice(0, 5).map((item) => {
                    const { id, title } = item;
                    return (
                    <li key={id}>{title}</li>
                    )
                })
            }
        </div>
    )
}

export default CommentItem;