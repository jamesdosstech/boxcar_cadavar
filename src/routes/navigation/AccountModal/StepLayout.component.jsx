import './StepLayout.styles.scss'
const StepLayout = ({title, children}) => {
  return (
    <div className="step-layout">
        <h3 className="step-title">{title}</h3>
        <div className="step-content">{children}</div>
    </div>
  )
}

export default StepLayout