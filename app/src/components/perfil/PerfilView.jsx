import Avatar from '../common/Avatar'
import EditIcon from '../../assets/icons/edit.svg?react'
import SettingsIcon from '../../assets/icons/settings.svg?react'

const Chevron = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const CameraIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z"
            stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
)

const TemaIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
)
import './PerfilView.css'

const compacto = (n) =>
    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`.replace('.', ',') : String(n)

/* Data de calendário: formatada a partir da string, sem passar por Date.
   `new Date('2004-01-20')` seria lido como meia-noite UTC e, em fusos
   negativos, exibiria o dia anterior. */
const dataBR = (valor) => {
    if (!valor) return '—'
    const [ano, mes, dia] = String(valor).slice(0, 10).split('-')
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : '—'
}

function Campo({ rotulo, valor, editavel, aoEditar }) {
    return (
        <div className="perfil-campo">
            <div className="perfil-campo-topo">
                <h3>{rotulo}</h3>
                {editavel && (
                    <button type="button" className="perfil-editar" onClick={aoEditar} aria-label={`Editar ${rotulo}`}>
                        <EditIcon aria-hidden="true" />
                    </button>
                )}
            </div>
            <p className="perfil-campo-valor">{valor || '—'}</p>
        </div>
    )
}

/**
 * Visualização de perfil compartilhada entre o perfil próprio e o público.
 * `proprio` liga os controles de edição e o bloco de configurações.
 */
function PerfilView({ usuario, proprio = false, titulo, aoEditar, aoEditarFoto, aoAbrirOpcoes, aoAlternarTema, temaEscuro = false, acaoPrincipal }) {
    const {
        name, alias, photoUrl, bio, email, birthDate, nationality,
        following = 0, followers = 0, memberSince, followsYou,
    } = usuario

    return (
        <div className="perfil">
            {/* Título só para leitores de tela — o container central não exibe
                rótulo de página, seguindo o padrão do feed. */}
            <h1 className="sr-only">{titulo}</h1>

            <section className="perfil-topo">
                <div className="perfil-identidade">
                    {proprio ? (
                        <button
                            type="button"
                            className="perfil-avatar-botao"
                            onClick={aoEditarFoto}
                            aria-label="Alterar foto de perfil"
                        >
                            <Avatar src={photoUrl} name={name} tamanho={64} />
                            <span className="perfil-avatar-camera" aria-hidden="true">
                                <CameraIcon />
                            </span>
                        </button>
                    ) : (
                        <Avatar src={photoUrl} name={name} tamanho={64} />
                    )}

                    <div className="perfil-nomes">
                        <div className="perfil-nome-linha">
                            <h2>{name}</h2>
                            {proprio && (
                                <button type="button" className="perfil-editar" onClick={() => aoEditar?.('name')} aria-label="Editar name">
                                    <EditIcon aria-hidden="true" />
                                </button>
                            )}
                        </div>
                        <span className="perfil-alias">@{alias}</span>

                        {/* Só aparece em perfil de terceiros: no próprio, o
                            servidor devolve null e a pergunta não faz sentido. */}
                        {followsYou && <span className="perfil-te-segue">segue você</span>}
                    </div>
                </div>

                <div className="perfil-numeros">
                    <p className="perfil-contadores">
                        <span><strong>{compacto(following)}</strong> seguindo</span>
                        <span><strong>{compacto(followers)}</strong> seguidores</span>
                    </p>
                    {memberSince && <span className="perfil-desde">No Blabry desde {memberSince}</span>}
                    {acaoPrincipal}
                </div>
            </section>

            <section className="perfil-bio">
                <div className="perfil-campo-topo">
                    <h3>Bio</h3>
                    {proprio && (
                        <button type="button" className="perfil-editar" onClick={() => aoEditar?.('bio')} aria-label="Editar bio">
                            <EditIcon aria-hidden="true" />
                        </button>
                    )}
                </div>
                <p className="perfil-bio-texto">{bio || 'Sem bio por enquanto.'}</p>
            </section>

            {/* Dados pessoais existem apenas no próprio perfil. O servidor já
                os devolve como null para visitantes; aqui a seção inteira não é
                renderizada, porque caixa vazia com um travessão anuncia que há
                algo escondido ali. O perfil público termina na bio. */}
            {proprio && (
                <section className="perfil-dados">
                    <Campo rotulo="E-mail" valor={email} editavel aoEditar={() => aoEditar?.('email')} />
                    <Campo rotulo="Nascimento" valor={dataBR(birthDate)} editavel aoEditar={() => aoEditar?.('birthDate')} />
                    <Campo rotulo="Nacionalidade" valor={nationality} editavel aoEditar={() => aoEditar?.('nationality')} />
                </section>
            )}

            {proprio && (
                <section className="perfil-config" aria-label="Ajustes">
                    <button
                        type="button"
                        className="perfil-config-item"
                        onClick={aoAlternarTema}
                        role="switch"
                        aria-checked={temaEscuro}
                    >
                        <span className="perfil-config-icone"><TemaIcon aria-hidden="true" /></span>
                        <span className="perfil-config-texto">
                            <strong>Tema</strong>
                            <small>{temaEscuro ? 'Escuro' : 'Claro'}</small>
                        </span>
                        <span className={`perfil-switch ${temaEscuro ? 'ligado' : ''}`} aria-hidden="true">
                            <span />
                        </span>
                    </button>

                    <button type="button" className="perfil-config-item" onClick={aoAbrirOpcoes}>
                        <span className="perfil-config-icone"><SettingsIcon aria-hidden="true" /></span>
                        <span className="perfil-config-texto">
                            <strong>Conta e segurança</strong>
                            <small>Senha, sessão e exclusão da conta</small>
                        </span>
                        <Chevron className="perfil-config-seta" aria-hidden="true" />
                    </button>
                </section>
            )}
        </div>
    )
}

export default PerfilView
