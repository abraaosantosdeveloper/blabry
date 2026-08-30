import AvatarIcon from '../../assets/icons/avatar.svg?react'
import './Avatar.css'

/** Foto de perfil com fallback para ícone genérico. `tamanho` em px. */
function Avatar({ src, nome = '', tamanho = 40, className = '' }) {
    const estilo = { width: tamanho, height: tamanho, minWidth: tamanho }

    return (
        <span className={`avatar ${className}`} style={estilo}>
            {src
                ? <img src={src} alt={nome ? `Foto de ${nome}` : 'Foto de perfil'} />
                : <AvatarIcon className="avatar-fallback" aria-hidden="true" />}
        </span>
    )
}

export default Avatar
