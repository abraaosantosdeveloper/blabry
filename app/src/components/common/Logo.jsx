import useTema from '../../hooks/useTema'
import logoTexto from '../../assets/icons/logo_text.svg'
import logoTextoEscuro from '../../assets/icons/logo_text_dark_theme.svg'
import logoMarca from '../../assets/icons/logo.svg'
import logoMarcaEscuro from '../../assets/icons/logo_dark_theme.svg'

/**
 * Logo da aplicação, trocando o arquivo conforme o tema.
 * @param {'texto'|'marca'} variante
 */
function Logo({ variante = 'texto', className = '', alt = 'Blabry' }) {
    const { escuro } = useTema()

    const arquivo = variante === 'marca'
        ? (escuro ? logoMarcaEscuro : logoMarca)
        : (escuro ? logoTextoEscuro : logoTexto)

    return <img src={arquivo} alt={alt} className={className} />
}

export default Logo
