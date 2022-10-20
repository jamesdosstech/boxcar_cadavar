import ImageIcon from '../../components/image-icon/image-icon.component'
import { Link } from 'react-router-dom'
const Splash = () => {
    const Title = 'Doosetrain'
    return (
        <div>
            <div className="App">
                <h1>{Title}</h1>
                <ImageIcon />
                <div>
                    <Link to='/showroom'>
                        Enter
                    </Link>
                </div>      
            </div>
        </div>
    )
}

export default Splash