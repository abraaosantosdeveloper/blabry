import Modal from './Modal'
import PostComposer from '../feed/PostComposer'

/** Modal do FAB: mesmo composer do feed, em cima de um overlay. */
function NovoPostModal({ aberto, aoFechar, author, aoPublicar, aoErro }) {
    async function publicar(text) {
        await aoPublicar(text)
        aoFechar()
    }

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} rotulo="Nova publicação">
            <PostComposer author={author} aoPublicar={publicar} aoErro={aoErro} focoAutomatico />
        </Modal>
    )
}

export default NovoPostModal
