import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import MenuContexto from '../common/MenuContexto'
import EditIcon from '../../assets/icons/edit.svg?react'
import TrashIcon from '../../assets/icons/trash.svg?react'
import { dentroDaJanela } from '../../utils/janelaEdicao'

const LIMITE = 280

const quando = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const minutos = Math.floor((Date.now() - d.getTime()) / 60000)
    if (minutos < 1) return 'agora'
    if (minutos < 60) return `${minutos}min`
    if (minutos < 1440) return `${Math.floor(minutos / 60)}h`
    if (minutos < 10080) return `${Math.floor(minutos / 1440)}d`
    return d.toLocaleDateString('pt-BR')
}

/** Um comentário, com edição no próprio lugar. */
function Comentario({ comentario, souAutor, aoEditar, aoExcluir }) {
    const [editando, setEditando] = useState(false)
    const [texto, setTexto] = useState(comentario.texto)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState(null)
    const campoRef = useRef(null)

    /* Reavaliado a cada render: um comentário publicado há 14 minutos deixa
       de ser editável enquanto a tela está aberta. */
    const podeEditar = souAutor && dentroDaJanela(comentario.criadoEm)

    useEffect(() => {
        if (!editando) return
        setTexto(comentario.texto)
        setErro(null)
        campoRef.current?.focus()
    }, [editando, comentario.texto])

    async function salvar(e) {
        e.preventDefault()
        const conteudo = texto.trim()
        if (!conteudo || salvando) return

        if (conteudo === comentario.texto) return setEditando(false)

        setSalvando(true)
        setErro(null)
        try {
            await aoEditar(comentario.id, conteudo)
            setEditando(false)
        } catch (err) {
            setErro(err?.message || 'Não foi possível salvar.')
        } finally {
            setSalvando(false)
        }
    }

    const acoes = []
    if (podeEditar) {
        acoes.push({ rotulo: 'Editar', Icone: EditIcon, aoClicar: () => setEditando(true) })
    }
    if (souAutor) {
        acoes.push({ rotulo: 'Excluir', Icone: TrashIcon, perigo: true, aoClicar: () => aoExcluir(comentario.id) })
    }

    return (
        <li className="comentario">
            <Link to={`/perfil/${comentario.autor.alias}`} className="comentario-avatar">
                <Avatar src={comentario.autor.fotoUrl} nome={comentario.autor.nome} tamanho={30} />
            </Link>

            <div className="comentario-corpo">
                <p className="comentario-cabecalho">
                    <Link to={`/perfil/${comentario.autor.alias}`}>{comentario.autor.nome}</Link>
                    <span>@{comentario.autor.alias}</span>
                    {comentario.criadoEm && (
                        <time dateTime={comentario.criadoEm}>· {quando(comentario.criadoEm)}</time>
                    )}
                    {comentario.editadoEm && (
                        <span
                            className="comentario-editado"
                            title={`Editado em ${new Date(comentario.editadoEm).toLocaleString('pt-BR')}`}
                        >
                            · editado
                        </span>
                    )}
                </p>

                {editando ? (
                    <form className="comentario-edicao" onSubmit={salvar}>
                        <input
                            ref={campoRef}
                            type="text"
                            value={texto}
                            maxLength={LIMITE}
                            onChange={(e) => setTexto(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Escape') setEditando(false) }}
                            aria-label="Editar comentário"
                        />

                        {erro && <p className="comentario-erro" role="alert">{erro}</p>}

                        <div className="comentario-edicao-acoes">
                            <button type="button" className="neutro" onClick={() => setEditando(false)}>
                                Cancelar
                            </button>
                            <button type="submit" disabled={!texto.trim() || salvando}>
                                {salvando ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="comentario-texto">{comentario.texto}</p>
                )}
            </div>

            {acoes.length > 0 && !editando && (
                <MenuContexto rotulo="Ações do comentário" itens={acoes} />
            )}
        </li>
    )
}

export default Comentario
