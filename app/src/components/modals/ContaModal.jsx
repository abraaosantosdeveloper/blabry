import { Link, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import AvatarIcon from '../../assets/icons/avatar.svg?react'
import LockIcon from '../../assets/icons/lock.svg?react'
import InfoIcon from '../../assets/icons/info.svg?react'
import LogoffIcon from '../../assets/icons/logoff.svg?react'
import DangerIcon from '../../assets/icons/danger.svg?react'
import TrashIcon from '../../assets/icons/trash.svg?react'
import './ContaModal.css'

const Chevron = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

/**
 * Opções da conta.
 *
 * Ações reversíveis ficam na lista neutra; a exclusão vive em uma região
 * separada e visualmente contida, e não executa nada por conta própria —
 * ela abre o fluxo de confirmação.
 */
function ContaModal({ aberto, aoFechar, aoAlterarSenha, aoExcluirConta }) {
    const navigate = useNavigate()

    function sair() {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        localStorage.removeItem('alias')
        localStorage.removeItem('photoUrl')
        navigate('/', { replace: true })
    }

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} titulo="Conta" icone={AvatarIcon}>
            <ul className="conta-lista">
                <li>
                    <button
                        type="button"
                        className="conta-item"
                        onClick={aoAlterarSenha}
                    >
                        <span className="conta-item-icone"><LockIcon aria-hidden="true" /></span>
                        <span className="conta-item-textos">
                            <strong>Alterar senha</strong>
                            <small>Enviamos um código para o seu e-mail.</small>
                        </span>
                        <Chevron className="conta-item-seta" aria-hidden="true" />
                    </button>
                </li>

                <li>
                    {/* Link, e não button+navigate: é navegação de verdade, então
                        deve permitir abrir em nova aba e ser lida como link pelo
                        leitor de tela. target="_blank" preserva o estado da tela
                        atual, já que a política é leitura de apoio. */}
                    <Link
                        className="conta-item"
                        to="/politica-de-privacidade"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="conta-item-icone"><InfoIcon aria-hidden="true" /></span>
                        <span className="conta-item-textos">
                            <strong>Política de privacidade</strong>
                            <small>Quais dados guardamos e como são tratados.</small>
                        </span>
                        <Chevron className="conta-item-seta" aria-hidden="true" />
                    </Link>
                </li>

                <li>
                    <button type="button" className="conta-item" onClick={sair}>
                        <span className="conta-item-icone"><LogoffIcon aria-hidden="true" /></span>
                        <span className="conta-item-textos">
                            <strong>Sair da conta</strong>
                            <small>Você poderá entrar de novo quando quiser.</small>
                        </span>
                        <Chevron className="conta-item-seta" aria-hidden="true" />
                    </button>
                </li>
            </ul>

            <section className="conta-risco" aria-labelledby="conta-risco-titulo">
                <h3 id="conta-risco-titulo">
                    <DangerIcon aria-hidden="true" />
                    Zona de risco
                </h3>

                <p>Ações desta área são permanentes e não podem ser desfeitas.</p>

                <button type="button" className="conta-risco-botao" onClick={aoExcluirConta}>
                    <TrashIcon aria-hidden="true" />
                    Excluir conta
                </button>
            </section>
        </Modal>
    )
}

export default ContaModal
