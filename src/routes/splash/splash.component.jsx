import './splash.styles.scss';
import ImageIcon from '../../components/image-icon/image-icon.component'
import { Link } from 'react-router-dom';

import Button from '../../components/button/button.component'

const Splash = () => {
    const Title = 'Doosetrain';
    const trainList = [
        {
            id: 0,
            name: 'Thomas'
        },
        {
            id: 1,
            name: 'James'
        },
        {
            id: 2,
            name: 'Doosetrain'
        },
        {
            id: 3,
            name: 'Larry Hoover'
        },
        {
            id: 4,
            name: 'Mary the Caboose'
        },
    ]

    const splashMessage = [
        {
            id: 0,
            welcomeMessage: 'welcome to doosetrain, friends',
            subtitle: 'live dj streams every friday.'
        },
    ]

    return (
        <div className="splash-container">
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {
                        trainList.map((train) => {
                            const { id, name } = train;
                            return (
                                <ImageIcon key={id} alt={`${name}`} />
                            )
                        })
                    }
                </div>
                <div>
                    <h1>
                        {splashMessage[0].welcomeMessage}
                    </h1>
                    <p>
                        {splashMessage[0].subtitle}
                    </p>
                </div>
            </div>
            <div>
                <Link to='/showroom'>
                    <Button>enter here</Button>
                </Link>
            </div>      
        </div>
    )
}

export default Splash