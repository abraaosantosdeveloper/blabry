import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PerfilView from '../components/perfil/PerfilView'
import EstadoLista from '../components/common/EstadoLista'
import Toast from '../components/toasts/Toast'
import useToast from '../hooks/useToast'
import { perfilPorAlias, alternarSeguir } from '../services/usuarios.service'
import { mensagemDeErro } from '../services/http'

function Perfil() {
    const { alias } = useParams()
    const [usuario, setUsuario] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [ocupado, setOcupado] = useState(false)
    const { toast, mostrarToast } = useToast()

    const carregar = useCallback(() => {
        const controller = new AbortController()
        setCarregando(true)
        setErro(null)

        perfilPorAlias(alias, { signal: controller.signal })
            .then(setUsuario)
            .catch((err) => { if (err.name !== 'AbortError') setErro(err) })
            .finally(() => { if (!controller.signal.aborted) setCarregando(false) })

        return () => controller.abort()
    }, [alias])

    useEffect(carregar, [carregar])

    async function seguir() {
        if (ocupado) return
        setOcupado(true)

        const anterior = { seguindoEste: usuario.seguindoEste, seguidores: usuario.seguidores }
        setUsuario((u) => ({
            ...u,
            seguindoEste: !u.seguindoEste,
            seguidores: u.seguidores + (u.seguindoEste ? -1 : 1),
        }))

        try {
            const dados = await alternarSeguir(alias, anterior.seguindoEste)
            setUsuario((u) => ({
                ...u,
                seguindoEste: dados.seguindo ?? !anterior.seguindoEste,
                seguidores: dados.seguidores ?? u.seguidores,
            }))
        } catch (err) {
            setUsuario((u) => ({ ...u, ...anterior }))
            mostrarToast(mensagemDeErro(err))
        } finally {
            setOcupado(false)
        }
    }

    const botaoSeguir = usuario && (
        <button
            type="button"
            className={`perfil-acao ${usuario.seguindoEste ? 'secundaria' : ''}`}
            onClick={seguir}
            disabled={ocupado}
        >
            {usuario.seguindoEste ? 'Seguindo' : 'Seguir'}
        </button>
    )

    return (
        <>
            <Toast {...toast} />

            {(carregando || erro) && (
                <EstadoLista carregando={carregando} erro={erro} aoTentarDeNovo={carregar} />
            )}

            {usuario && (
                <PerfilView usuario={usuario} titulo="Perfil" acaoPrincipal={botaoSeguir} />
            )}
        </>
    )
}

export default Perfil
