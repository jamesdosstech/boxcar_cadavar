import TrainIcon from '../../assets/train-icon.svg';
import './image-icon.styles.scss';

const ImageIcon = () => {
    return (
        <div className='image-icon-container'>
            <img src={TrainIcon} />
        </div>
    )
}

export default ImageIcon