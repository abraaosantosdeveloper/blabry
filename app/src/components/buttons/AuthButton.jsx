import './AuthButton.css'

function AuthButton({ label, onClick }) {
    return (
        <button className="auth-btn" onClick={onClick}>
            {label}
        </button>
    )
}

export default AuthButton