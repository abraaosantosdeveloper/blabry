import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import MenuContexto from '../common/MenuContexto'
import EditIcon from '../../assets/icons/edit.svg?react'
import TrashIcon from '../../assets/icons/trash.svg?react'
import { dentroDaJanela } from '../../utils/janelaEdicao'

const LIMITE = 500

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
    const [text, setTexto] = useState(comentario.text)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState(null)
    const campoRef = useRef(null)

    /* Reavaliado a cada render: um comentário publicado há 14 minutos deixa
       de ser editável enquanto a tela está aberta. */
    const podeEditar = souAutor && dentroDaJanela(comentario.createdAt)

    useEffect(() => {
        if (!editando) return
        setTexto(comentario.text)
        setErro(null)
        campoRef.current?.focus()
    }, [editando, comentario.text])

    async function salvar(e) {
        e.preventDefault()
        const conteudo = text.trim()
        if (!conteudo || salvando) return

        if (conteudo === comentario.text) return setEditando(false)

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
            <Link to={`/profile/${comentario.author.alias}`} className="comentario-avatar">
                <Avatar src={comentario.author.photoUrl} name={comentario.author.name} tamanho={30} />
            </Link>

            <div className="comentario-corpo">
                <p className="comentario-cabecalho">
                    <Link to={`/profile/${comentario.author.alias}`}>{comentario.author.name}</Link>
                    <span>@{comentario.author.alias}</span>
                    {comentario.createdAt && (
                        <time dateTime={comentario.createdAt}>· {quando(comentario.createdAt)}</time>
                    )}
                    {comentario.editedAt && (
                        <span
                            className="comentario-editado"
                            title={`Editado em ${new Date(comentario.editedAt).toLocaleString('pt-BR')}`}
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
                            value={text}
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
                            <button type="submit" disabled={!text.trim() || salvando}>
                                {salvando ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="comentario-texto">{comentario.text}</p>
                )}
            </div>

            {acoes.length > 0 && !editando && (
                <MenuContexto rotulo="Ações do comentário" itens={acoes} />
            )}
        </li>
    )
}

export default Comentario
