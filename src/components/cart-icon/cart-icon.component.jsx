import ShopIconImg from '../../assets/shopping-cart.svg';
import './cart-icon.styles.scss';

const CartIcon = ({alt}) => {
    return (
        <div className='image-icon-container'>
            <img style={{backgroundColor: 'blue'}} alt={alt} src={ShopIconImg} />
        </div>
    )
}

export default CartIcon