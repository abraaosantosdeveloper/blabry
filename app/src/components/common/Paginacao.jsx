import './Paginacao.css'

/** Controles de página. Some quando há uma página só. */
function Paginacao({ pagina, totalPaginas, aoAnterior, aoProxima, ocupado = false }) {
    if (totalPaginas <= 1) return null

    return (
        <nav className="paginacao" aria-label="Paginação">
            <button type="button" onClick={aoAnterior} disabled={pagina <= 1 || ocupado}>
                Anterior
            </button>

            <span aria-live="polite">Página {pagina} de {totalPaginas}</span>

            <button type="button" onClick={aoProxima} disabled={pagina >= totalPaginas || ocupado}>
                Próxima
            </button>
        </nav>
    )
}

export default Paginacao
