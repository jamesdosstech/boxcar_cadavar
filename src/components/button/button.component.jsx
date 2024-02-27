import './button.styles.scss'

const BUTTON_TYPE_CLASSES = {
    splash: 'splash-enter',
    google: 'google-sign-in',
    submit: ''
}

const Button = ({ children, buttonType, ...otherProps }) => {
    return (
        <button 
            className={`button-container ${BUTTON_TYPE_CLASSES[buttonType]}`}
            {...otherProps}
        >
            {children}
        </button>
    )
}

export default Button;