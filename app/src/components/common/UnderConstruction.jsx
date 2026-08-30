import ConstructionLogo from '../../assets/icons/under_construction_logo.svg?react'
import './UnderConstruction.css'

function UnderConstruction({ mensagem = 'Esta página ainda está em desenvolvimento.' }) {
    return (
        <div className="under-construction" role="status">
            <ConstructionLogo className="under-construction-logo" aria-hidden="true" />
            <p className="under-construction-texto">{mensagem}</p>
        </div>
    )
}

export default UnderConstruction
