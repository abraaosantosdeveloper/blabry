import { useCallback, useEffect, useState } from 'react'
import PerfilView from '../components/perfil/PerfilView'
import ContaModal from '../components/modals/ContaModal'
import ExcluirContaModal from '../components/modals/ExcluirContaModal'
import EditarCampoModal from '../components/modals/EditarCampoModal'
import FotoPerfilModal from '../components/modals/FotoPerfilModal'
import EstadoLista from '../components/common/EstadoLista'
import Toast from '../components/toasts/Toast'
import useToast from '../hooks/useToast'
import useTema from '../hooks/useTema'
import { meuPerfil, atualizarPerfil, enviarFoto } from '../services/usuarios.service'

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
            )}

            <FotoPerfilModal
                aberto={fotoAberta}
                aoFechar={() => setFotoAberta(false)}
                aoSalvar={async (blob) => {
                    const { fotoUrl } = await enviarFoto(blob)
                    setUsuario((atual) => ({ ...atual, fotoUrl }))
                    localStorage.setItem('fotoUrl', fotoUrl)
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
                aoAvisar={(mensagem) => {
                    setOpcoesAbertas(false)
                    mostrarToast(mensagem)
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
                aoConfirmar={() => {
                    // TODO: DELETE /users/me quando a rota existir.
                    setExclusaoAberta(false)
                    mostrarToast('A exclusão de conta ainda está em desenvolvimento.')
                }}
            />
        </>
    )
}

export default MeuPerfil
