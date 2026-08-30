import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from './Modal'
import Avatar from '../common/Avatar'
import EstadoLista from '../common/EstadoLista'
import Paginacao from '../common/Paginacao'
import useDebounce from '../../hooks/useDebounce'
import usePaginado from '../../hooks/usePaginado'
import { buscarUsuarios } from '../../services/usuarios.service'
import MagnifierIcon from '../../assets/icons/magnifier.svg?react'
import './BuscaModal.css'

const MINIMO = 2

function BuscaModal({ aberto, aoFechar }) {
    const [termo, setTermo] = useState('')
    const termoDebounced = useDebounce(termo.trim(), 400)
    const ativo = aberto && termoDebounced.length >= MINIMO

    const buscar = useCallback(
        ({ pagina, signal }) => buscarUsuarios({ q: termoDebounced, pagina, signal }),
        [termoDebounced]
    )

    const {
        itens: usuarios, pagina, totalPaginas, total,
        carregando, erro, anterior, proxima, recarregar,
    } = usePaginado(buscar, { campo: 'usuarios', ativo, deps: [termoDebounced] })

    const resumo = useMemo(() => {
        if (!ativo || carregando || erro) return null
        return total === 1 ? '1 resultado' : `${total} resultados`
    }, [ativo, carregando, erro, total])

    const fechar = useCallback(() => {
        setTermo('')
        aoFechar()
    }, [aoFechar])

    return (
        <Modal aberto={aberto} aoFechar={fechar} rotulo="Pesquisar">
            <div className="busca-campo">
                <MagnifierIcon aria-hidden="true" />
                <label htmlFor="busca-input" className="sr-only">Pesquisar usuários</label>
                <input
                    id="busca-input"
                    type="search"
                    placeholder="Pesquisar usuários..."
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                    autoFocus
                    autoComplete="off"
                />
            </div>

            {!ativo && (
                <p className="busca-dica">
                    {termo.trim().length === 0
                        ? 'Digite um nome ou @ para começar.'
                        : `Digite pelo menos ${MINIMO} caracteres.`}
                </p>
            )}

            {ativo && (
                <>
                    {resumo && <p className="busca-resumo">{resumo}</p>}

                    <EstadoLista
                        carregando={carregando}
                        erro={erro}
                        vazio={!carregando && !erro && usuarios.length === 0}
                        mensagemVazio="Nenhum usuário encontrado."
                        aoTentarDeNovo={recarregar}
                    />

                    {!carregando && !erro && usuarios.length > 0 && (
                        <ul className="busca-lista">
                            {usuarios.map((u) => (
                                <li key={u.alias}>
                                    <Link to={`/perfil/${u.alias}`} className="busca-item" onClick={fechar}>
                                        <Avatar src={u.fotoUrl} nome={u.nome} tamanho={38} />
                                        <span className="busca-item-textos">
                                            <strong>{u.nome}</strong>
                                            <small>@{u.alias}</small>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Paginacao
                        pagina={pagina}
                        totalPaginas={totalPaginas}
                        aoAnterior={anterior}
                        aoProxima={proxima}
                        ocupado={carregando}
                    />
                </>
            )}
        </Modal>
    )
}

export default BuscaModal
