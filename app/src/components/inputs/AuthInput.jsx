import './AuthInput.css'

function AuthInput({ label, placeholder, fieldType, fieldId, value, onChange, erro = false, ...resto }) {
    return (
        <div className={`field-group ${erro ? 'com-erro' : ''}`}>
            <label htmlFor={fieldId}>{label}</label>
            <input
                type={fieldType}
                id={fieldId}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                aria-invalid={erro}
                {...resto}
            />
        </div>
    )
}

export default AuthInput
