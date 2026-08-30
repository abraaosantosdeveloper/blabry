import './OptionSelect.css'

function OptionSelect({
    label, fieldId, value, onChange, options = [],
    erro = false, carregando = false, placeholder = 'Selecione...',
}) {
    return (
        <div className={`field-group ${erro ? 'com-erro' : ''}`}>
            <label htmlFor={fieldId}>{label}</label>
            <select id={fieldId} value={value} onChange={onChange} aria-invalid={erro} disabled={carregando}>
                <option value="">{carregando ? 'Carregando...' : placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}

export default OptionSelect
