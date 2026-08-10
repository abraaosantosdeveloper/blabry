import './OptionSelect.css'

function OptionSelect({ label, fieldId, value, onChange, options = [] }) {
    return (
        <div className='field-group'>
            <label htmlFor={fieldId}>{label}</label>
            <select id={fieldId} value={value} onChange={onChange}>
                <option value="">Selecione...</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default OptionSelect

