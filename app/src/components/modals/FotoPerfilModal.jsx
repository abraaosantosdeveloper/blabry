import { useEffect, useState } from 'react'
import Modal from './Modal'
import PhotoCrop from '../upload/PhotoCrop'
import './FotoPerfilModal.css'

/**
 * Troca da foto de perfil.
 * O recorte acontece no PhotoCrop; aqui fica a confirmação e o envio.
 */
function FotoPerfilModal({ aberto, aoFechar, aoSalvar }) {
    const [foto, setFoto] = useState(null)
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState(null)

    useEffect(() => {
        if (aberto) return
        setFoto(null); setEnviando(false); setErro(null)
    }, [aberto])

    async function salvar() {
        if (!foto || enviando) return
        setEnviando(true)
        setErro(null)
        try {
            await aoSalvar(foto)
        } catch (err) {
            setErro(err?.message || 'Não foi possível enviar a foto.')
            setEnviando(false)
        }
    }

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} rotulo="Foto de perfil">
            <div className="foto-modal">
                <h2 className="foto-modal-titulo">Foto de perfil</h2>

                <PhotoCrop onCortar={setFoto} />

                {erro && <p className="foto-modal-erro" role="alert">{erro}</p>}

                <div className="foto-modal-acoes">
                    <button type="button" className="foto-modal-botao neutro" onClick={aoFechar}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="foto-modal-botao"
                        onClick={salvar}
                        disabled={!foto || enviando}
                    >
                        {enviando ? 'Enviando...' : 'Salvar foto'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default FotoPerfilModal
