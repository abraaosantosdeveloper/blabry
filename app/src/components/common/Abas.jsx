import './Abas.css'

/**
 * Abas com indicador roxo sob a selecionada — mesmo padrão do item ativo
 * do menu lateral, na horizontal.
 *
 * @param {{id: string, rotulo: string}[]} itens
 */
function Abas({ itens, ativa, aoTrocar, rotulo = 'Seções' }) {
    function aoTeclar(e) {
        const indice = itens.findIndex((i) => i.id === ativa)
        if (e.key === 'ArrowRight') aoTrocar(itens[(indice + 1) % itens.length].id)
        if (e.key === 'ArrowLeft') aoTrocar(itens[(indice - 1 + itens.length) % itens.length].id)
    }

    return (
        <div className="abas" role="tablist" aria-label={rotulo} onKeyDown={aoTeclar}>
            {itens.map(({ id, rotulo: text }) => (
                <button
                    key={id}
                    type="button"
                    role="tab"
                    id={`aba-${id}`}
                    aria-selected={ativa === id}
                    aria-controls={`painel-${id}`}
                    tabIndex={ativa === id ? 0 : -1}
                    className={`abas-item ${ativa === id ? 'ativa' : ''}`}
                    onClick={() => aoTrocar(id)}
                >
                    {text}
                </button>
            ))}
        </div>
    )
}

export default Abas
