import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from './Modal'
import Abas from '../common/Abas'
import Avatar from '../common/Avatar'
import EstadoLista from '../common/EstadoLista'
import Paginacao from '../common/Paginacao'
import useDebounce from '../../hooks/useDebounce'
import usePaginado from '../../hooks/usePaginado'
import { buscarUsuarios } from '../../services/users.service'
import { buscarPosts } from '../../services/posts.service'
import MagnifierIcon from '../../assets/icons/magnifier.svg?react'
import './BuscaModal.css'

/* Usuários usa LIKE com prefixo; posts usa índice FULLTEXT, cujo
   innodb_ft_min_token_size padrão é 3 — palavras menores são ignoradas
   na indexação e a busca voltaria vazia sem explicação. */
const MINIMO_POR_ABA = { posts: 3, users: 2 }

const ABAS = [
    { id: 'posts', rotulo: 'Posts' },
    { id: 'users', rotulo: 'Usuários' },
]

const CAMPO_POR_ABA = { posts: 'posts', users: 'users' }

const trecho = (text, termo, tamanho = 160) => {
    const conteudo = String(text ?? '')
    const posicao = conteudo.toLowerCase().indexOf(termo.toLowerCase())
    if (posicao <= tamanho / 2) return conteudo.slice(0, tamanho) + (conteudo.length > tamanho ? '…' : '')
    const inicio = Math.max(0, posicao - tamanho / 2)
    return '…' + conteudo.slice(inicio, inicio + tamanho) + '…'
}

function BuscaModal({ aberto, aoFechar }) {
    const [termo, setTermo] = useState('')
    const [aba, setAba] = useState('posts')

    /* Atalho: digitar "@" salta para Usuários e sai da consulta. O usuário
       não precisa saber disso — as abas continuam visíveis e clicáveis. */
    const comArroba = termo.trimStart().startsWith('@')
    const consulta = (comArroba ? termo.trimStart().slice(1) : termo).trim()

    useEffect(() => {
        if (comArroba) setAba('users')
    }, [comArroba])

    const termoDebounced = useDebounce(consulta, 400)
    const minimo = MINIMO_POR_ABA[aba]
    const ativo = aberto && termoDebounced.length >= minimo

    const buscar = useCallback(
        ({ page, signal }) => (aba === 'users'
            ? buscarUsuarios({ q: termoDebounced, page, signal })
            : buscarPosts({ q: termoDebounced, page, signal })),
        [aba, termoDebounced]
    )

    const {
        itens, page, totalPages, total,
        carregando, erro, anterior, proxima, recarregar,
    } = usePaginado(buscar, {
        campo: CAMPO_POR_ABA[aba],
        ativo,
        deps: [aba, termoDebounced],
    })

    const resumo = useMemo(() => {
        if (!ativo || carregando || erro) return null
        return total === 1 ? '1 resultado' : `${total} resultados`
    }, [ativo, carregando, erro, total])

    const fechar = useCallback(() => {
        setTermo('')
        setAba('posts')
        aoFechar()
    }, [aoFechar])

    return (
        <Modal aberto={aberto} aoFechar={fechar} rotulo="Pesquisar">
            <div className="busca-campo">
                <MagnifierIcon aria-hidden="true" />
                <label htmlFor="busca-input" className="sr-only">Pesquisar</label>
                <input
                    id="busca-input"
                    type="search"
                    placeholder={aba === 'users' ? 'Nome ou @ do usuário...' : 'Buscar nos blabs...'}
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                    autoFocus
                    autoComplete="off"
                />
            </div>

            <Abas itens={ABAS} ativa={aba} aoTrocar={setAba} rotulo="Tipo de resultado" />

            <div id={`painel-${aba}`} role="tabpanel" aria-labelledby={`aba-${aba}`}>
                {!ativo && (
                    <p className="busca-dica">
                        {consulta.length === 0
                            ? (aba === 'users'
                                ? 'Digite um nome ou @ para começar.'
                                : 'Digite uma palavra para buscar nos blabs.')
                            : `Digite pelo menos ${minimo} caracteres.`}
                    </p>
                )}

                {ativo && (
                    <>
                        {resumo && <p className="busca-resumo">{resumo}</p>}

                        <EstadoLista
                            carregando={carregando}
                            erro={erro}
                            vazio={!carregando && !erro && itens.length === 0}
                            mensagemVazio={aba === 'users'
                                ? 'Nenhum usuário encontrado.'
                                : 'Nenhum blab encontrado.'}
                            aoTentarDeNovo={recarregar}
                        />

                        {!carregando && !erro && itens.length > 0 && (
                            <ul className="busca-lista">
                                {aba === 'users'
                                    ? itens.map((u) => (
                                        <li key={u.alias}>
                                            <Link to={`/perfil/${u.alias}`} className="busca-item" onClick={fechar}>
                                                <Avatar src={u.photoUrl} name={u.name} tamanho={38} />
                                                <span className="busca-item-textos">
                                                    <strong>{u.name}</strong>
                                                    <small>@{u.alias}</small>
                                                </span>
                                            </Link>
                                        </li>
                                    ))
                                    : itens.map((p) => (
                                        <li key={p.id}>
                                            {/* Resultado de post leva ao post, não ao perfil do
                                                author: quem buscou uma palavra quer ver a
                                                publicação que a contém. O name do author
                                                aparece como informação, não como destino. */}
                                            <Link to={`/post/${p.id}`} className="busca-item alinhado-topo" onClick={fechar}>
                                                <Avatar src={p.author.photoUrl} name={p.author.name} tamanho={38} />
                                                <span className="busca-item-textos">
                                                    <strong>
                                                        {p.author.name}
                                                        <span className="busca-item-alias">@{p.author.alias}</span>
                                                    </strong>
                                                    <span className="busca-item-trecho">
                                                        {trecho(p.text, termoDebounced)}
                                                    </span>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        )}

                        <Paginacao
                            page={page}
                            totalPages={totalPages}
                            aoAnterior={anterior}
                            aoProxima={proxima}
                            ocupado={carregando}
                        />
                    </>
                )}
            </div>
        </Modal>
    )
}

export default BuscaModal
