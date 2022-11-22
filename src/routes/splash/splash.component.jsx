import './splash.styles.scss';

import { useCountdown } from '../../hooks/usecountdown.component'

import SplashEnter from '../../components/splash-enter/splash-enter.component'
import SplashTimer from '../../components/splash-timer/splash-timer.component'

const Splash = ({targetDate}) => {
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
            subtitle: 'live dj streams every friday'
        },
        {
            id: 1,
            welcomeMessage: 'welcome to doosetrain, friends',
            subtitle: "you're early! the next show starts in...",
            reminder: 'see you friday!'
        }
    ]

    const [days, hours, minutes, seconds] = useCountdown(targetDate)
    const date = new Date();
    return (
        <div className='App'>
            {
                date.getDay() === 2 ?
                <SplashEnter 
                    message={splashMessage} trainList={trainList}
                /> :
                <SplashTimer 
                    days={days}
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    message={splashMessage} trainList={trainList}
                />
            }
        </div>
    )
}

export default Splash