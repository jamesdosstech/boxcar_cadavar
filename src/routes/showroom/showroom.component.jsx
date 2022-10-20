import ImageIcon from '../../components/image-icon/image-icon.component'
import { Link } from 'react-router-dom'
const Showroom = () => {
    const Title = 'Showroom'
    return (
        <div className="App">
            <h1>{Title}</h1>
            <ImageIcon />
            <div>
                <Link to='/'>
                    Back
                </Link>
            </div>        
        </div>
    )
}

export default Showroom