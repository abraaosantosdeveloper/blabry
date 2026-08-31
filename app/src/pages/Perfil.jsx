import { useCallback, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import PerfilView from '../components/perfil/PerfilView'
import EstadoLista from '../components/common/EstadoLista'
import Toast from '../components/toasts/Toast'
import useToast from '../hooks/useToast'
import useUsuarioAtual from '../hooks/useUsuarioAtual'
import { perfilPorAlias, alternarSeguir } from '../services/usuarios.service'
import { mensagemDeErro } from '../services/http'

function Perfil() {
    const { alias } = useParams()
    const usuarioAtual = useUsuarioAtual()
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

    /* O servidor devolve seguindoEste como null no próprio perfil — a
       pergunta não faz sentido ali. Serve como segunda barreira caso o
       redirecionamento acima não tenha acontecido. */
    const botaoSeguir = usuario && usuario.seguindoEste !== null && (
        <button
            type="button"
            className={`perfil-acao ${usuario.seguindoEste ? 'secundaria' : ''}`}
            onClick={seguir}
            disabled={ocupado}
        >
            {usuario.seguindoEste ? 'Seguindo' : 'Seguir'}
        </button>
    )

    /* Chegar ao próprio perfil pela URL pública é normal — basta clicar no
       seu nome em um post. Redirecionar para /perfil/me evita uma segunda
       tela do mesmo perfil, sem os lápis de edição e com um botão de seguir
       que a API recusaria.

       A comparação espera o alias carregar: no primeiro render ele pode
       estar vazio, e redirecionar aí levaria todo mundo para o próprio
       perfil. */
    if (usuarioAtual?.alias && usuarioAtual.alias === alias) {
        return <Navigate to="/perfil/me" replace />
    }

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
