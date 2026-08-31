import './Paginacao.css'

/** Controles de página. Some quando há uma página só. */
function Paginacao({ page, totalPages, aoAnterior, aoProxima, ocupado = false }) {
    if (totalPages <= 1) return null

    return (
        <nav className="paginacao" aria-label="Paginação">
            <button type="button" onClick={aoAnterior} disabled={page <= 1 || ocupado}>
                Anterior
            </button>

            <span aria-live="polite">Página {page} de {totalPages}</span>

            <button type="button" onClick={aoProxima} disabled={page >= totalPages || ocupado}>
                Próxima
            </button>
        </nav>
    )
}

export default Paginacao
