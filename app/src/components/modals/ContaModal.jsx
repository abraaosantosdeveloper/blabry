import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import AvatarIcon from '../../assets/icons/avatar.svg?react'
import LockIcon from '../../assets/icons/lock.svg?react'
import LogoffIcon from '../../assets/icons/logoff.svg?react'
import DangerIcon from '../../assets/icons/danger.svg?react'
import TrashIcon from '../../assets/icons/trash.svg?react'

/** Modal "Mais opções" do perfil: conta e zona de risco. */
function ContaModal({ aberto, aoFechar, aoAvisar }) {
    const navigate = useNavigate()

    function sair() {
        localStorage.removeItem('token')
        localStorage.removeItem('nome')
        navigate('/', { replace: true })
    }

    const emBreve = (recurso) => () =>
        aoAvisar?.(`${recurso} ainda está em desenvolvimento.`)

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} titulo="Conta" icone={AvatarIcon}>
            <div className="modal-lista">
                <button type="button" className="modal-item" onClick={emBreve('Alterar senha')}>
                    <LockIcon aria-hidden="true" />
                    Alterar Senha
                </button>

                <button type="button" className="modal-item perigo" onClick={sair}>
                    <LogoffIcon aria-hidden="true" />
                    Fazer logoff
                </button>
            </div>

            <h3 className="modal-secao">
                <DangerIcon aria-hidden="true" />
                Zona de risco
            </h3>

            <div className="modal-lista">
                <button type="button" className="modal-item perigo" onClick={emBreve('Exclusão de conta')}>
                    <TrashIcon aria-hidden="true" />
                    Excluir conta
                </button>
            </div>
        </Modal>
    )
}

export default ContaModal
