import { useCallback, useEffect, useState } from 'react'
import PerfilView from '../components/perfil/PerfilView'
import ContaModal from '../components/modals/ContaModal'
import EstadoLista from '../components/common/EstadoLista'
import Toast from '../components/toasts/Toast'
import useToast from '../hooks/useToast'
import { meuPerfil } from '../services/usuarios.service'

function MeuPerfil() {
    const [usuario, setUsuario] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [opcoesAbertas, setOpcoesAbertas] = useState(false)
    const { toast, mostrarToast } = useToast()

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
                    aoEditar={(campo) => mostrarToast(`A edição de ${campo} ainda está em desenvolvimento.`)}
                    aoAlternarTema={() => mostrarToast('O tema escuro ainda está em desenvolvimento.')}
                    aoAbrirOpcoes={() => setOpcoesAbertas(true)}
                />
            )}

            <ContaModal
                aberto={opcoesAbertas}
                aoFechar={() => setOpcoesAbertas(false)}
                aoAvisar={(mensagem) => {
                    setOpcoesAbertas(false)
                    mostrarToast(mensagem)
                }}
            />
        </>
    )
}

export default MeuPerfil
