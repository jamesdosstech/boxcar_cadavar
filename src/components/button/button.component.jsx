import './button.styles.scss'

const BUTTON_TYPE_CLASSES = {
    splash: 'splash-enter',
    google: 'google-sign-in'
}

const Button = ({ children, buttonType, ...otherProps }) => {
    return (
        <button className="button-container">
            {children}
        </button>
    )
}

export default Button;