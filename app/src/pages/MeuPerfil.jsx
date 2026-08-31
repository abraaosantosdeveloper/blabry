import { useCallback, useEffect, useState } from 'react'
import PerfilView from '../components/perfil/PerfilView'
import PostsDoPerfil from '../components/perfil/PostsDoPerfil'
import ContaModal from '../components/modals/ContaModal'
import ExcluirContaModal from '../components/modals/ExcluirContaModal'
import EditarCampoModal from '../components/modals/EditarCampoModal'
import FotoPerfilModal from '../components/modals/FotoPerfilModal'
import EstadoLista from '../components/common/EstadoLista'
import Toast from '../components/toasts/Toast'
import useToast from '../hooks/useToast'
import useTema from '../hooks/useTema'
import useUsuarioAtual from '../hooks/useUsuarioAtual'
import {
    meuPerfil, atualizarPerfil, enviarFoto,
    solicitarCodigoExclusao, excluirConta,
} from '../services/users.service'
import { mensagemDeErro } from '../services/http'
import { useNavigate } from 'react-router-dom'

function MeuPerfil() {
    const [usuario, setUsuario] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [opcoesAbertas, setOpcoesAbertas] = useState(false)
    const [exclusaoAberta, setExclusaoAberta] = useState(false)
    const [campoEditando, setCampoEditando] = useState(null)
    const [fotoAberta, setFotoAberta] = useState(false)
    const { toast, mostrarToast } = useToast()
    const { escuro, alternar } = useTema()
    const usuarioAtual = useUsuarioAtual()
    const navigate = useNavigate()

    const carregar = useCallback(() => {
        const controller = new AbortController()
        setCarregando(true)
        setErro(null)

        meuPerfil({ signal: controller.signal })
            .then(setUsuario)
            .catch((err) => { if (err.name !== 'AbortError') setErro(err) })
            .finally(() => { if (!controller.signal.aborted) setCarregando(false) })

        return () => controller.abort()
    }, [])

    useEffect(carregar, [carregar])

    return (
        <>
            <Toast {...toast} />

            {(carregando || erro) && (
                <EstadoLista carregando={carregando} erro={erro} aoTentarDeNovo={carregar} />
            )}

            {usuario && (
                <>
                <PerfilView
                    usuario={usuario}
                    proprio
                    titulo="Meu Perfil"
                    aoEditar={setCampoEditando}
                    aoEditarFoto={() => setFotoAberta(true)}
                    temaEscuro={escuro}
                    aoAlternarTema={alternar}
                    aoAbrirOpcoes={() => setOpcoesAbertas(true)}
                />

                {/* Mesmo componente do perfil de terceiros. O que muda —
                    poder editar ou excluir — é decidido dentro do PostCard,
                    comparando o author da publicação com o usuário do token,
                    e não por uma variante desta tela. */}
                <PostsDoPerfil
                    alias={usuario.alias}
                    autorAtual={usuarioAtual ?? usuario}
                    aoErro={mostrarToast}
                />
                </>
            )}

            <FotoPerfilModal
                aberto={fotoAberta}
                aoFechar={() => setFotoAberta(false)}
                aoSalvar={async (blob) => {
                    const { photoUrl } = await enviarFoto(blob)
                    setUsuario((atual) => ({ ...atual, photoUrl }))
                    localStorage.setItem('photoUrl', photoUrl)
                    setFotoAberta(false)
                    mostrarToast('Foto atualizada!', 'sucesso')
                }}
            />

            <EditarCampoModal
                aberto={Boolean(campoEditando)}
                campo={campoEditando}
                usuario={usuario}
                aoFechar={() => setCampoEditando(null)}
                aoSalvar={async (corpo) => {
                    // O servidor devolve o perfil já normalizado — é ele que
                    // vira o novo estado, não o que foi digitado.
                    const atualizado = await atualizarPerfil(corpo)
                    setUsuario(atualizado)
                    setCampoEditando(null)
                    mostrarToast('Perfil atualizado!', 'sucesso')
                }}
            />

            <ContaModal
                aberto={opcoesAbertas}
                aoFechar={() => setOpcoesAbertas(false)}
                aoAlterarSenha={() => {
                    setOpcoesAbertas(false)
                    /* A troca de senha reaproveita a mesma tela pública de
                       recuperação: o fluxo é idêntico (código por e-mail e
                       nova senha), e manter duas telas para a mesma operação
                       seria manter duas chances de divergirem.

                       O e-mail segue pelo `state`, não pela URL. */
                    navigate('/recuperar-senha', { state: { email: usuario?.email } })
                }}
                aoExcluirConta={() => {
                    setOpcoesAbertas(false)
                    setExclusaoAberta(true)
                }}
            />

            <ExcluirContaModal
                aberto={exclusaoAberta}
                aoFechar={() => setExclusaoAberta(false)}
                email={usuario?.email}
                /* O modal só exibe; quem fala com a API é a página. Assim o
                   componente continua reutilizável e testável sem rede. */
                aoPedirCodigo={solicitarCodigoExclusao}
                aoConfirmar={async ({ code }) => {
                    try {
                        await excluirConta(code)

                        /* A sessão morre junto com a conta: o token continuaria
                           válido pela assinatura até expirar, mas não há mais
                           conta por trás dele. Limpar aqui evita uma tela
                           autenticada apontando para um usuário inexistente. */
                        localStorage.clear()
                        navigate('/', { replace: true })
                    } catch (err) {
                        mostrarToast(mensagemDeErro(err))
                    }
                }}
            />
        </>
    )
}

export default MeuPerfil
