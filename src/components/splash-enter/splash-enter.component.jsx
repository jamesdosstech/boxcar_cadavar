import './splash-enter.styles.scss';

import { Link } from 'react-router-dom';

import Button from '../button/button.component'
import ImageIcon from '../image-icon/image-icon.component'

const SplashEnter = ({message, trainList}) => {
    return (
        <div className="container-fluid">
            {/* <div className="row">
                {
                    trainList.map((train) => {
                        const { id, name } = train;
                        return (
                            <div className='col-sm'>
                            <ImageIcon key={id} alt={`${name}`} />

                            </div>
                        )
                    })
                }
            </div> */}
            <div className='row'>
                <h1>
                    {message[0].welcomeMessage}
                </h1>
                <p>
                    {message[0].subtitle}
                </p>
            </div>
                {/* <div>
                    <h1>
                        {message[0].welcomeMessage}
                    </h1>
                    <p>
                        {message[0].subtitle}
                    </p>
                </div> */}
            <div>
                <Link className='btn btn-dark' to='/showroom'>
                    Enter Here
                </Link>
            </div>      
        </div>
    )
}

export default SplashEnter