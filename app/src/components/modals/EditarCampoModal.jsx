import Modal from './Modal'
import EditarCampoForm, { CAMPOS } from './EditarCampoForm'

/**
 * Edição de um campo do perfil, em modal próprio.
 *
 * Usado pelos lápis do perfil — nome e bio. Os dados pessoais (e-mail,
 * nascimento e nacionalidade) são editados dentro da modal de Conta, que
 * monta o mesmo formulário sem abrir uma segunda janela.
 *
 * Este componente ficou como casca: toda a lógica vive em EditarCampoForm.
 */
function EditarCampoModal({ aberto, campo, usuario, aoFechar, aoSalvar }) {
    const config = CAMPOS[campo]
    if (!config) return null

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} rotulo={config.titulo}>
            <EditarCampoForm
                ativo={aberto}
                campo={campo}
                usuario={usuario}
                aoCancelar={aoFechar}
                aoSalvar={aoSalvar}
            />
        </Modal>
    )
}

export default EditarCampoModal
