import Avatar from '../common/Avatar'
import EditIcon from '../../assets/icons/edit.svg?react'
import SettingsIcon from '../../assets/icons/settings.svg?react'
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
function PerfilView({ usuario, proprio = false, titulo, aoEditar, aoAbrirOpcoes, aoAlternarTema, acaoPrincipal }) {
    const {
        nome, alias, fotoUrl, bio, email, nascimento, nacionalidade,
        seguindo = 0, seguidores = 0, desde,
    } = usuario

    return (
        <div className="perfil">
            {/* Título só para leitores de tela — o container central não exibe
                rótulo de página, seguindo o padrão do feed. */}
            <h1 className="sr-only">{titulo}</h1>

            <section className="perfil-topo">
                <div className="perfil-identidade">
                    <Avatar src={fotoUrl} nome={nome} tamanho={64} />

                    <div className="perfil-nomes">
                        <div className="perfil-nome-linha">
                            <h2>{nome}</h2>
                            {proprio && (
                                <button type="button" className="perfil-editar" onClick={() => aoEditar?.('nome')} aria-label="Editar nome">
                                    <EditIcon aria-hidden="true" />
                                </button>
                            )}
                        </div>
                        <span className="perfil-alias">@{alias}</span>
                    </div>
                </div>

                <div className="perfil-numeros">
                    <p className="perfil-contadores">
                        <span><strong>{compacto(seguindo)}</strong> seguindo</span>
                        <span><strong>{compacto(seguidores)}</strong> seguidores</span>
                    </p>
                    {desde && <span className="perfil-desde">No Blabry desde {desde}</span>}
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

            <section className="perfil-dados">
                <Campo rotulo="E-mail" valor={email} editavel={proprio} aoEditar={() => aoEditar?.('email')} />
                <Campo rotulo="Nascimento" valor={dataBR(nascimento)} editavel={proprio} aoEditar={() => aoEditar?.('nascimento')} />
                <Campo rotulo="Nacionalidade" valor={nacionalidade} editavel={proprio} aoEditar={() => aoEditar?.('nacionalidade')} />
            </section>

            {proprio && (
                <section className="perfil-config">
                    <button type="button" className="perfil-config-item" onClick={aoAlternarTema}>
                        <span className="perfil-switch" aria-hidden="true"><span /></span>
                        <span className="perfil-config-texto">
                            <strong>Tema</strong>
                            <small>Claro</small>
                        </span>
                    </button>

                    <button type="button" className="perfil-config-item centro" onClick={aoAbrirOpcoes}>
                        <SettingsIcon aria-hidden="true" />
                        <strong>Mais Opções</strong>
                    </button>
                </section>
            )}
        </div>
    )
}

export default PerfilView
