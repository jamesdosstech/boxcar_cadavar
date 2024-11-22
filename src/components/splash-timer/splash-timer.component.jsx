import DateDisplay from '../date-display/date-display.component';
import ImageIcon from '../image-icon/image-icon.component';
import './splash-timer.styles.scss';

const SplashTimer = ({ days, hours, minutes, seconds, message, trainList }) => {
  // Destructure the message object for easier access
  const { welcomeMessage, subtitle, reminder } = message[1];

  return (
    <div className='splash-timer-container'>
      <div>
        <ImageIcon />
      </div>
      <h1>{welcomeMessage}</h1>
      <p>{subtitle}</p>
      <div className='splash-date-display-container'>
        <DateDisplay value={days} type={'Days'} />
        <DateDisplay value={hours} type={'Hours'} />
        <DateDisplay value={minutes} type={'Mins'} />
        <DateDisplay value={seconds} type={'Seconds'} />
      </div>
      <p>{reminder}</p>
    </div>
  );
};

export default SplashTimer;
