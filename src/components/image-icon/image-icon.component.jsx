import TrainIcon from '../../assets/train-icon.svg';
import './image-icon.styles.scss';

const ImageIcon = ({alt}) => {
    return (
        <div className='image-icon-container'>
            <img alt={alt} src={TrainIcon} />
        </div>
    )
}

export default ImageIcon