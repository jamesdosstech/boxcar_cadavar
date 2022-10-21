import './date-display.styles.scss';

const DateDisplay = ({value, type}) => {
    return (
        <div className='date-display-container'>
            <div className='date-item-container'>
                <p className='date-item-text'>{value}</p>    
            </div>
            <p className='date-time-text'>{type}</p>
        </div>
    )
}

export default DateDisplay