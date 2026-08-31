import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import BuscaModal from '../modals/BuscaModal'
import HomeIcon from '../../assets/icons/home.svg?react'
import ChatsIcon from '../../assets/icons/chats.svg?react'
import AvatarIcon from '../../assets/icons/avatar.svg?react'
import BellIcon from '../../assets/icons/bell.svg?react'
import MagnifierIcon from '../../assets/icons/magnifier.svg?react'
import Logo from '../common/Logo'
import './AppLayout.css'

const NAVEGACAO = [
    { para: '/feed', rotulo: 'Feed', Icone: HomeIcon },
    { para: '/conversas', rotulo: 'Conversas', Icone: ChatsIcon },
    { para: '/perfil/me', rotulo: 'Perfil', Icone: AvatarIcon },
]

/**
 * Casca da aplicação: topo fixo, menu lateral no desktop e navbar inferior
 * no mobile.
 *
 * @param {number} naoLidas Quantidade de CONVERSAS com mensagens não lidas —
 *   não o total de mensagens. Três conversas não lidas exibem 3, mesmo que
 *   somem centenas de mensagens entre elas.
 *   Fica em zero até a rota de notificações existir.
 */
function AppLayout({ naoLidas = 0 }) {
    const [buscaAberta, setBuscaAberta] = useState(false)

    return (
        <div className="app-shell">
            <header className="app-topo">
                <NavLink to="/feed" className="app-logo" aria-label="Blabry — ir para o feed">
                    <Logo />
                </NavLink>

                <div className="app-topo-acoes">
                    <button
                        type="button"
                        className="icone-botao"
                        onClick={() => setBuscaAberta(true)}
                        aria-label="Pesquisar"
                    >
                        <MagnifierIcon aria-hidden="true" />
                    </button>
                    <button type="button" className="icone-botao" aria-label="Novidades">
                        <BellIcon aria-hidden="true" />
                        {naoLidas > 0 && (
                            <span className="badge" aria-label={`${naoLidas} conversas não lidas`}>
                                {naoLidas > 9 ? '9+' : naoLidas}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <div className="app-corpo">
                <nav className="app-menu" aria-label="Menu principal">
                    <h2 className="app-menu-titulo">Menu</h2>
                    {NAVEGACAO.map(({ para, rotulo, Icone }) => (
                        <NavLink key={para} to={para} className="app-menu-item" aria-label={rotulo} title={rotulo}>
                            <Icone aria-hidden="true" />
                            <span>{rotulo}</span>
                        </NavLink>
                    ))}
                </nav>

                <main className="app-conteudo">
                    <div className="app-coluna">
                        <Outlet />
                    </div>
                </main>
            </div>

            <nav className="app-navbar" aria-label="Navegação">
                {NAVEGACAO.map(({ para, rotulo, Icone }) => (
                    <NavLink key={para} to={para} className="app-navbar-item">
                        <Icone aria-hidden="true" />
                        <span>{rotulo}</span>
                    </NavLink>
                ))}
            </nav>

            <BuscaModal aberto={buscaAberta} aoFechar={() => setBuscaAberta(false)} />
        </div>
    )
}

export default AppLayout
