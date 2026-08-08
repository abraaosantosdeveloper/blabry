import './AuthButton.css'

function AuthButton({ label, onClick }) {
    return (
        <button className="auth-btn">
            {label}
        </button>
    )
}

export default AuthButton