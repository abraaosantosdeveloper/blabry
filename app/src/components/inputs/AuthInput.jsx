import './AuthInput.css'

function AuthInput({
    label, /* Conteúdo do Label do Campo */
    placeholder, /* Texto do Placeholder */
    fieldType, /* Password, Email, Number, text... */
    fieldId,
    value,
    onChange
}) {
    return (
        <div className='field-group'>
            <label>{label}</label>
            <input type={fieldType} id={fieldId} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    )
}

export default AuthInput