import { useState } from 'react'
import Modal from './Modal'
import DangerIcon from '../../assets/icons/danger.svg?react'
import './ConfirmarModal.css'

/**
 * Confirmação de uma ação destrutiva mas de baixo impacto — apagar um post,
 * por exemplo. Ações irreversíveis de alto impacto, como excluir a conta,
 * pedem um fluxo com mais etapas.
 */
function ConfirmarModal({
    aberto, aoFechar, aoConfirmar,
    titulo, mensagem,
    rotuloConfirmar = 'Confirmar',
    rotuloCancelar = 'Cancelar',
}) {
    const [ocupado, setOcupado] = useState(false)

    async function confirmar() {
        if (ocupado) return
        setOcupado(true)
        try {
            await aoConfirmar()
        } finally {
            setOcupado(false)
        }
    }

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} rotulo={titulo}>
            <div className="confirmar">
                <div className="confirmar-cabecalho">
                    <span className="confirmar-icone"><DangerIcon aria-hidden="true" /></span>
                    <h2>{titulo}</h2>
                </div>

                <p className="confirmar-mensagem">{mensagem}</p>

                <div className="confirmar-acoes">
                    <button type="button" className="confirmar-botao neutro" onClick={aoFechar}>
                        {rotuloCancelar}
                    </button>
                    <button
                        type="button"
                        className="confirmar-botao perigo"
                        onClick={confirmar}
                        disabled={ocupado}
                    >
                        {ocupado ? 'Aguarde...' : rotuloConfirmar}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmarModal
