import Modal from './Modal'
import PostComposer from '../feed/PostComposer'

/** Modal do FAB: mesmo composer do feed, em cima de um overlay. */
function NovoPostModal({ aberto, aoFechar, autor, aoPublicar, aoErro }) {
    async function publicar(texto) {
        await aoPublicar(texto)
        aoFechar()
    }

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} rotulo="Nova publicação">
            <PostComposer autor={autor} aoPublicar={publicar} aoErro={aoErro} focoAutomatico />
        </Modal>
    )
}

export default NovoPostModal
