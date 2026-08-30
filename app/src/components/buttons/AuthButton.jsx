import './AuthButton.css'

function AuthButton({ label, onClick, carregando = false, variante = 'primario', compacto = false, type = 'button' }) {
    return (
        <button
            type={type}
            className={`auth-btn ${variante} ${compacto ? 'compacto' : ''}`}
            onClick={onClick}
            disabled={carregando}
        >
            {carregando ? <span className="spinner" role="status" aria-label="Carregando" /> : label}
        </button>
    )
}

export default AuthButton
