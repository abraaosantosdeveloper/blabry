import './AtualizacoesPill.css'

function AtualizacoesPill({ visivel, aoClicar }) {
    if (!visivel) return null

    return (
        <button type="button" className="atualizacoes-pill" onClick={aoClicar}>
            <span className="atualizacoes-pill-ponto" aria-hidden="true" />
            Ver novos Blabs
        </button>
    )
}

export default AtualizacoesPill