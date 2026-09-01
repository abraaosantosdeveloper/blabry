import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import { SERVICOS, SeloServico } from '../components/common/LogosHospedagem'
import './PoliticaPrivacidade.css'

/* Data da última revisão do texto. Fica em constante, e não solta no JSX,
   porque é informação jurídica: quem revisa a política precisa achar isso
   em um lugar só, e a data precisa mudar junto com o conteúdo. */
const ATUALIZADA_EM = '31 de agosto de 2026'

/**
 * Seção da política.
 *
 * Recebe um id porque o sumário no topo aponta para cada uma via âncora;
 * sem id nomeado, os links do sumário não teriam para onde ir.
 */
function Secao({ id, titulo, children }) {
    return (
        <section className="pp-secao" id={id} aria-labelledby={`${id}-titulo`}>
            <h2 id={`${id}-titulo`}>{titulo}</h2>
            {children}
        </section>
    )
}

/* O sumário é derivado desta lista, e não escrito à mão duas vezes: assim
   nenhuma seção nova pode existir sem aparecer no índice. */
const SUMARIO = [
    ['sobre', 'Sobre a plataforma'],
    ['coleta', 'Quais dados coletamos'],
    ['tratamento', 'Como tratamos esses dados'],
    ['criptografia', 'Criptografia e segurança'],
    ['compartilhamento', 'Com quem compartilhamos'],
    ['direitos', 'Seus direitos'],
    ['retencao', 'Por quanto tempo guardamos'],
    ['contato', 'Contato'],
]

/**
 * Página pública da política de privacidade.
 *
 * É pública de propósito: o cadastro exige aceitá-la, e exigir login para
 * ler aquilo que se está aceitando seria um ciclo impossível de fechar.
 */
function PoliticaPrivacidade() {
    const navigate = useNavigate()

    return (
        <main className="pp">
            <header className="pp-cabecalho">
                {/* O logo leva para a raiz por Link e não por botão de voltar:
                    quem chega aqui por um link direto (fora do app) não tem
                    histórico para voltar. */}
                <Link to="/" aria-label="Ir para o início">
                    <Logo className="pp-logo" alt="Blabry" />
                </Link>

                {/* navigate(-1) só é oferecido como conveniência secundária;
                    se não houver histórico, o navegador simplesmente ignora. */}
                <button type="button" className="pp-voltar" onClick={() => navigate(-1)}>
                    Voltar
                </button>
            </header>

            <h1 className="pp-titulo">Política de Privacidade</h1>
            <p className="pp-data">Última atualização: {ATUALIZADA_EM}</p>

            <nav className="pp-sumario" aria-label="Sumário da política">
                <ol>
                    {SUMARIO.map(([id, rotulo]) => (
                        <li key={id}><a href={`#${id}`}>{rotulo}</a></li>
                    ))}
                </ol>
            </nav>

            <Secao id="sobre" titulo="Sobre a plataforma">
                <p>
                    O Blabry é uma rede social de mensagens curtas: você publica textos,
                    comenta, curte e segue outras pessoas. O projeto é mantido de forma
                    independente, com finalidade educacional e de portfólio, e não tem
                    fins publicitários — não exibimos anúncios e não vendemos dados.
                </p>
                <p>
                    Tudo o que você publica em uma publicação ou comentário é <strong>público</strong>:
                    fica visível para qualquer pessoa que acesse a plataforma, inclusive
                    sem estar logada. Trate essa área como você trataria um mural aberto.
                </p>
            </Secao>

            <Secao id="coleta" titulo="Quais dados coletamos">
                <p>Coletamos apenas o que a aplicação precisa para funcionar:</p>
                <ul className="pp-lista">
                    <li>
                        <strong>Dados de cadastro:</strong> nome, @ (identificador único),
                        e-mail, data de nascimento e nacionalidade. A data de nascimento
                        existe para verificar a idade mínima de 13 anos.
                    </li>
                    <li>
                        <strong>Senha:</strong> nunca guardamos a senha em si. Guardamos
                        apenas um hash dela — veja a seção de criptografia.
                    </li>
                    <li>
                        <strong>Conteúdo que você cria:</strong> publicações, comentários,
                        curtidas, quem você segue e quem segue você.
                    </li>
                    <li>
                        <strong>Foto de perfil:</strong> opcional. Se enviada, é
                        armazenada em serviço externo de mídia.
                    </li>
                    <li>
                        <strong>Datas técnicas:</strong> data de criação da conta, de
                        publicação e de edição dos conteúdos.
                    </li>
                </ul>
                <p>
                    Não coletamos localização, contatos, dados bancários nem dados
                    sensíveis (origem racial, religião, opinião política, saúde,
                    biometria ou vida sexual). Não usamos cookies de rastreamento nem
                    ferramentas de publicidade de terceiros.
                </p>
            </Secao>

            <Secao id="tratamento" titulo="Como tratamos esses dados">
                <p>
                    Cada dado é usado para uma finalidade determinada, e nada além dela:
                </p>
                <ul className="pp-lista">
                    <li>E-mail e senha: autenticar você e recuperar o acesso.</li>
                    <li>Nome, @ e foto: identificar você para outras pessoas.</li>
                    <li>Data de nascimento: confirmar a idade mínima.</li>
                    <li>Nacionalidade: exibida apenas no seu próprio perfil.</li>
                    <li>Publicações, comentários, curtidas e seguidores: montar o feed e os perfis.</li>
                </ul>
                <p>
                    O <strong>perfil público</strong> mostra somente nome, @, foto, bio,
                    contagem de seguidores e de quem você segue, e o ano em que a conta
                    foi criada. E-mail, data de nascimento e nacionalidade aparecem
                    apenas para você, quando está autenticado na própria conta — a API
                    devolve esses campos vazios para qualquer visitante.
                </p>
            </Secao>

            <Secao id="criptografia" titulo="Criptografia e segurança">
                <ul className="pp-lista">
                    <li>
                        <strong>Senhas:</strong> passam por <code>bcrypt</code>, um
                        algoritmo de hash lento e com salt individual por usuário. Hash
                        é uma via de mão única: nem nós conseguimos ler sua senha
                        original a partir do que está gravado. Salt individual significa
                        que duas pessoas com a mesma senha geram hashes diferentes, o
                        que inutiliza tabelas de senhas pré-calculadas.
                    </li>
                    <li>
                        <strong>Transporte:</strong> todo o tráfego entre seu navegador,
                        a interface e a API acontece sobre HTTPS (TLS), então o conteúdo
                        não trafega legível pela rede.
                    </li>
                    <li>
                        <strong>Sessão:</strong> após o login, sua identidade é carregada
                        em um token JWT assinado pelo servidor. O servidor confia no que
                        está no token, nunca no que o cliente afirma sobre si mesmo em
                        um formulário.
                    </li>
                    <li>
                        <strong>Códigos por e-mail:</strong> a verificação de conta, a
                        troca de senha e a exclusão de conta usam códigos temporários
                        enviados para o e-mail cadastrado. Eles têm validade curta e
                        deixam de valer depois do uso.
                    </li>
                </ul>
            </Secao>

            <Secao id="compartilhamento" titulo="Com quem compartilhamos">
                <p>
                    Não vendemos, alugamos nem cedemos seus dados. Eles só passam pelos
                    serviços de infraestrutura necessários para a plataforma existir,
                    listados no rodapé desta página, e sempre no limite da função de
                    cada um. Podemos ainda divulgar informações se houver ordem judicial
                    ou obrigação legal.
                </p>
            </Secao>

            <Secao id="direitos" titulo="Seus direitos">
                <p>
                    De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018),
                    você pode a qualquer momento:
                </p>
                <ul className="pp-lista">
                    <li>Confirmar que tratamos seus dados e acessá-los.</li>
                    <li>Corrigir dados incompletos ou desatualizados — direto no seu perfil.</li>
                    <li>Excluir sua conta e os dados associados a ela.</li>
                    <li>Revogar o consentimento dado neste documento, o que implica encerrar a conta.</li>
                </ul>
                <p>
                    A exclusão fica em <em>Conta e segurança → Zona de risco → Excluir
                    conta</em>, e é confirmada por um código enviado ao seu e-mail.
                </p>
            </Secao>

            <Secao id="retencao" titulo="Por quanto tempo guardamos">
                <p>
                    Enquanto sua conta existir. Ao excluí-la, acontecem duas coisas.
                </p>
                <p>
                    Suas publicações, comentários e curtidas são <strong>apagados</strong> do
                    banco de dados. Não ficam ocultos: deixam de existir.
                </p>
                <p>
                    Seus dados de cadastro são <strong>anonimizados</strong>. Nome, e-mail,
                    data de nascimento, nacionalidade, bio e foto são esvaziados, e o
                    registro que resta não permite identificar você — o que a Lei Geral de
                    Proteção de Dados, no artigo 12, trata como dado fora do seu alcance.
                    Seu e-mail e seu @ voltam a ficar livres, então você pode se cadastrar
                    de novo com eles se quiser.
                </p>
                <p>
                    Optamos por anonimizar em vez de apagar a linha por uma razão concreta:
                    apagá-la removeria em cascata as curtidas que você deu em publicações de
                    outras pessoas, e os contadores delas cairiam sem que ninguém tivesse
                    pedido. Encerrar a sua conta não deve alterar o conteúdo de terceiros.
                </p>
                <p>
                    Cópias residuais podem permanecer por curto período em backups
                    automáticos dos serviços de infraestrutura até serem sobrescritas pelo
                    ciclo normal desses backups.
                </p>
            </Secao>

            <Secao id="contato" titulo="Contato">
                <p>
                    Dúvidas sobre esta política ou sobre seus dados podem ser enviadas
                    para <a href="mailto:abraaofilipi12@gmail.com">abraaofilipi12@gmail.com</a>.
                </p>
            </Secao>

            {/* ---------- Rodapé: infraestrutura ---------- */}
            <footer className="pp-rodape">
                <h2>Onde a plataforma roda</h2>
                <p className="pp-rodape-nota">
                    Estes são os serviços de terceiros que sustentam o Blabry. Cada um
                    trata seus dados sob a própria política de privacidade.
                </p>

                <ul className="pp-servicos">
                    {SERVICOS.map((s) => (
                        <li key={s.id} className="pp-servico">
                            <SeloServico sigla={s.sigla} cor={s.cor} />
                            <div className="pp-servico-textos">
                                {/* rel="noreferrer" impede que o site de destino saiba
                                    de qual página o usuário veio; noopener evita que a
                                    aba aberta ganhe referência à nossa janela. */}
                                <a href={s.site} target="_blank" rel="noopener noreferrer">{s.name}</a>
                                <small>{s.papel}</small>
                            </div>
                        </li>
                    ))}
                </ul>

                <p className="pp-rodape-fim">
                    Blabry — projeto independente. <Link to="/">Voltar ao início</Link>
                </p>
            </footer>
        </main>
    )
}

export default PoliticaPrivacidade
