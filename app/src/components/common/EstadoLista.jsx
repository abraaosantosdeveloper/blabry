import './EstadoLista.css'

/** Estados de carregamento, erro e vazio para qualquer lista da aplicação. */
function EstadoLista({ carregando, erro, vazio, mensagemVazio = 'Nada por aqui ainda.', aoTentarDeNovo }) {
    if (carregando) {
        return (
            <div className="estado-lista" role="status" aria-live="polite">
                <span className="estado-spinner" aria-hidden="true" />
                <span className="sr-only">Carregando</span>
            </div>
        )
    }

    if (erro) {
        return (
            <div className="estado-lista" role="alert">
                <p>Não foi possível carregar.</p>
                {aoTentarDeNovo && (
                    <button type="button" className="estado-acao" onClick={aoTentarDeNovo}>
                        Tentar de novo
                    </button>
                )}
            </div>
        )
    }

    if (vazio) {
        return (
            <div className="estado-lista">
                <p>{mensagemVazio}</p>
            </div>
        )
    }

    return null
}

export default EstadoLista
