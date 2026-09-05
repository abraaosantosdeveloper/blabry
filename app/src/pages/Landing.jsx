import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

import logoText from '../assets/icons/logo_text.svg';
import smilingUsingCellphone from '../assets/webp_assets/smiling-using-cellphone.webp';
import groupSelfie from '../assets/webp_assets/group-selfie.webp';
import fotoProfissional from '../assets/webp_assets/foto-profissional.webp';

export default function Landing() {
    useEffect(() => {
        const reduce =
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const heroItems = document.querySelectorAll('.hero .reveal');
        const revealItems = document.querySelectorAll(
            '.reveal:not(.hero .reveal)'
        );

        /*
         * Hero: entra imediatamente
         */
        if (!reduce) {
            heroItems.forEach((el, index) => {
                el.classList.add('hero-enter');
                el.style.animationDelay = `${index * 70}ms`;
            });
        } else {
            heroItems.forEach((el) => {
                el.classList.add('is-visible');
            });
        }

        /*
         * Sem IntersectionObserver:
         * mostra tudo
         */
        if (
            reduce ||
            !('IntersectionObserver' in window)
        ) {
            revealItems.forEach((el) => {
                el.classList.add('is-visible');
            });

            return;
        }

        /*
         * Restante da página:
         * anima conforme entra na tela
         */
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        revealItems.forEach((el) => {
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="landing-page">
            <header>
                <nav className="nav">
                    <Link to="/" className="logo">
                        <img
                            src={logoText}
                            alt="Blabry"
                            className="logo-img"
                        />
                    </Link>

                    <div className="nav-links">
                        <a href="#sobre" className="hide-mobile">
                            Sobre
                        </a>

                        <a href="#recursos" className="hide-mobile">
                            Recursos
                        </a>

                        <a href="#tecnologia" className="hide-mobile">
                            Tecnologia
                        </a>

                        <a href="#dev" className="hide-mobile">
                            Desenvolvedor
                        </a>

                        <Link to="/signup" className="btn btn-primary">
                            Criar conta
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                {/* HERO */}
                <section className="hero">
                    <div className="wrap hero-grid">
                        <div>
                            <h1 className="reveal">
                                Uma rede social para conversar.
                            </h1>

                            <p className="hero-sub reveal">
                                Sem anúncios. Sem vídeos tentando prender sua
                                atenção. Sem competição pra parecer interessante.
                                No Blabry, a conversa é o conteúdo — o resto é só
                                distração.
                            </p>

                            <div className="hero-cta reveal">
                                <Link
                                    to="/signup"
                                    className="btn btn-primary"
                                >
                                    Criar minha conta
                                </Link>

                                <a
                                    href="#sobre"
                                    className="link-underline"
                                >
                                    Ver como funciona
                                </a>
                            </div>

                            <div className="hero-note reveal">
                                <span className="dot"></span>

                                <span className="mono">
                                    Em desenvolvimento ativo
                                </span>
                            </div>
                        </div>

                        <div className="hero-photo reveal">
                            <div className="frame">
                                <img
                                    src={smilingUsingCellphone}
                                    alt="Pessoa sorrindo enquanto usa o celular"
                                    loading="eager"
                                />
                            </div>

                            <div className="float-card float-1">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                >
                                    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3 8.38 8.38 0 0 1 21 11.5Z" />
                                </svg>

                                Nova mensagem
                            </div>

                            <div className="float-card float-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                >
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                                </svg>

                                Testado e aprovado
                            </div>
                        </div>
                    </div>
                </section>

                {/* MANIFESTO */}
                <section className="manifesto" id="sobre">
                    <div className="wrap manifesto-grid">
                        <div className="reveal">
                            <span className="eyebrow-plain">
                                O que é o Blabry
                            </span>

                            <h2>
                                Nascida de uma vaga perdida, virou um jeito
                                diferente de pensar rede social.
                            </h2>
                        </div>

                        <div className="manifesto-body reveal">
                            <p className="pull-quote">
                                Perdi uma vaga de desenvolvedor por não saber
                                WebSockets. A resposta foi construir uma rede
                                social inteira em cima desse recurso.
                            </p>

                            <p>
                                O Blabry é um microblog com cara de Threads:
                                publique um "blab", curta, comente, siga quem
                                quiser. Mas por baixo, tudo foi desenhado para
                                funcionar em tempo real — do jeito que uma
                                conversa de verdade funciona, não do jeito que
                                um formulário funciona.
                            </p>

                            <p>
                                É também o meu projeto de portfólio como
                                desenvolvedor back-end, então cada decisão de
                                arquitetura aqui — autenticação, banco de dados,
                                segurança — foi tomada para ser defendida, não
                                só para funcionar.
                            </p>
                        </div>
                    </div>
                </section>

                {/* RECURSOS */}
                <section id="recursos">
                    <div className="wrap">
                        <div className="section-head reveal">
                            <span className="eyebrow-plain">
                                Recursos
                            </span>

                            <h2
                                className="section-title"
                                style={{ marginTop: '10px' }}
                            >
                                O que já dá pra fazer — e o que está a caminho
                            </h2>
                        </div>

                        <div className="feature-row reveal">
                            <div>
                                <span className="mono feature-tag">
                                    Feed
                                </span>

                                <h3>
                                    Publicações em tempo real
                                </h3>

                                <span className="feature-status status-live">
                                    Parcialmente implementado
                                </span>
                            </div>

                            <p className="desc">
                                Escreva um blab, curta e comente sem sair da
                                tela. Uma pílula discreta pra avisar quando há
                                postagens novas está no desenho do produto —
                                sem notificação forçada, sem badge cutucando
                                por conteúdo que ninguém te endereçou.
                            </p>
                        </div>

                        <div className="feature-row reveal">
                            <div>
                                <span className="mono feature-tag">
                                    Perfil
                                </span>

                                <h3>
                                    Perfil público e privado
                                </h3>

                                <span className="feature-status status-live">
                                    Disponível
                                </span>
                            </div>

                            <p className="desc">
                                Nome e bio são públicos; e-mail, nascimento e
                                nacionalidade só você vê. Siga pessoas,
                                acompanhe seguidores e edite tudo em um único
                                lugar, sem lápis espalhado pela tela.
                            </p>
                        </div>

                        <div className="feature-row reveal">
                            <div>
                                <span className="mono feature-tag">
                                    Chat
                                </span>

                                <h3>
                                    Conversas privadas com Socket.io
                                </h3>

                                <span className="feature-status status-soon">
                                    Em desenvolvimento
                                </span>
                            </div>

                            <p className="desc">
                                Mensagens diretas com status de entrega e, na
                                sequência, criptografia ponta a ponta desenhada
                                para que nem o banco de dados consiga ler o
                                conteúdo de uma conversa.
                            </p>
                        </div>

                        <div className="feature-row reveal">
                            <div>
                                <span className="mono feature-tag">
                                    Conta
                                </span>

                                <h3>
                                    Segurança de verdade
                                </h3>

                                <span className="feature-status status-live">
                                    Disponível
                                </span>
                            </div>

                            <p className="desc">
                                Senha com bcrypt e regras mínimas de força,
                                verificação por e-mail, limite de tentativas por
                                rota e exclusão de conta por anonimização —
                                encerrar a sua conta nunca apaga curtidas ou
                                comentários de outras pessoas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* COMMUNITY / MID PHOTO */}
                <section id="comunidade">
                    <div className="wrap">
                        <div className="community reveal">
                            <img
                                src={groupSelfie}
                                alt="Grupo de amigos sorrindo e conversando ao ar livre"
                                loading="lazy"
                            />

                            <div className="community-content">
                                <h2>
                                    Pensado para quem gosta de estar por dentro,
                                    não só de postar.
                                </h2>

                                <p>
                                    O Blabry ainda é pequeno — e isso é bom. Cada
                                    conta nova entra numa comunidade onde dá pra
                                    acompanhar de verdade quem está postando, não
                                    só rolar o feed no piloto automático.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEED CARDS */}
                <section>
                    <div className="wrap">
                        <div className="section-head reveal">
                            <span className="eyebrow-plain">
                                Direto do feed
                            </span>

                            <h2
                                className="section-title"
                                style={{ marginTop: '10px' }}
                            >
                                Publicações reais de quem já testa o Blabry
                            </h2>
                        </div>

                        <div className="feed-cards">
                            <div className="feed-card reveal">
                                <div className="feed-card-head">
                                    <div className="avatar">
                                        DC
                                    </div>

                                    <div>
                                        <div className="feed-card-name">
                                            Dayvid Cristiano
                                        </div>

                                        <div className="feed-card-alias">
                                            @dayvidcristiano
                                        </div>
                                    </div>
                                </div>

                                <p className="feed-card-text">
                                    Testado e aprovado! 💜
                                </p>

                                <div className="feed-card-meta">
                                    <span>♥ 1</span>
                                    <span>💬 1</span>
                                </div>
                            </div>

                            <div className="feed-card reveal">
                                <div className="feed-card-head">
                                    <div className="avatar">
                                        KA
                                    </div>

                                    <div>
                                        <div className="feed-card-name">
                                            Kezia Aguiar
                                        </div>

                                        <div className="feed-card-alias">
                                            @keziaguiar
                                        </div>
                                    </div>
                                </div>

                                <p className="feed-card-text">
                                    Olar ♥
                                </p>

                                <div className="feed-card-meta">
                                    <span>♥ 1</span>
                                    <span>💬 1</span>
                                </div>
                            </div>

                            <div className="feed-card reveal">
                                <div className="feed-card-head">
                                    <div className="avatar">
                                        JR
                                    </div>

                                    <div>
                                        <div className="feed-card-name">
                                            Jackson Rose
                                        </div>

                                        <div className="feed-card-alias">
                                            @jacksonrose25
                                        </div>
                                    </div>
                                </div>

                                <p className="feed-card-text">
                                    Quem ta ai? Boa noitee;)
                                </p>

                                <div className="feed-card-meta">
                                    <span>♥ 1</span>
                                    <span>💬 1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TECNOLOGIA */}
                <section id="tecnologia" className="manifesto">
                    <div className="wrap">
                        <div className="section-head reveal">
                            <span className="eyebrow-plain">
                                Por baixo do capô
                            </span>

                            <h2
                                className="section-title"
                                style={{ marginTop: '10px' }}
                            >
                                Construído com uma stack pensada em camadas
                            </h2>
                        </div>

                        <p
                            className="reveal"
                            style={{
                                color: 'var(--ink-soft)',
                                maxWidth: '62ch',
                                marginTop: '8px',
                            }}
                        >
                            Rota → Controller → Service → Repository →
                            banco de dados. Nenhuma consulta SQL fora do
                            repositório, nenhum ID vindo do cliente, nenhuma
                            senha guardada em texto puro.
                        </p>

                        <div className="tech-chips reveal">
                            <span className="chip">React 19</span>
                            <span className="chip">Vite</span>
                            <span className="chip">React Router</span>
                            <span className="chip">Node.js</span>
                            <span className="chip">Express 5</span>
                            <span className="chip">Socket.io</span>
                            <span className="chip">MySQL</span>
                            <span className="chip">JWT</span>
                            <span className="chip">bcrypt</span>
                            <span className="chip">AES-256-GCM</span>
                            <span className="chip">Cloudinary</span>
                            <span className="chip">Resend</span>
                            <span className="chip">Railway</span>
                            <span className="chip">Docusaurus</span>
                        </div>
                    </div>
                </section>

                {/* DEV */}
                <section id="dev">
                    <div className="wrap">
                        <div className="dev-card reveal">
                            <img
                                src={fotoProfissional}
                                alt="Abraão Santos"
                                className="dev-avatar"
                            />

                            <div>
                                <h3>
                                    Abraão Santos
                                </h3>

                                <div className="dev-role">
                                    Estudante de ADS na Cesar School · Dev
                                    Back-end · criador do Blabry
                                </div>

                                <p className="dev-bio">
                                    Comecei o Blabry depois de perder uma vaga
                                    por não dominar WebSockets. Em vez de só
                                    estudar o tópico isolado, resolvi construir
                                    uma rede social inteira com tempo real no
                                    centro — arquitetura em camadas, segurança
                                    auditada e decisões de banco de dados que eu
                                    consigo explicar uma a uma.
                                </p>

                                <div className="dev-links">
                                    <a
                                        href="https://github.com/abraaosantosdeveloper"
                                        className="link-underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
                                    </a>

                                    <Link
                                        to="/signup"
                                        className="link-underline"
                                    >
                                        Ver o projeto por dentro
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section>
                    <div className="wrap">
                        <div className="final-cta reveal">
                            <div>
                                <h2>
                                    Sua conta no Blabry leva menos de um minuto.
                                </h2>

                                <p>
                                    Publique seu primeiro blab, siga quem quiser
                                    e acompanhe o chat chegando nas próximas
                                    semanas.
                                </p>
                            </div>

                            <Link
                                to="/signup"
                                className="btn btn-on-dark"
                            >
                                Criar minha conta
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer>
                <div className="wrap">
                    <div className="footer-row">
                        <Link to="/" className="logo">
                            <img
                                src={logoText}
                                alt="Blabry"
                                className="logo-img"
                            />
                        </Link>

                        <div className="footer-links">
                            <a href="#sobre">
                                Sobre
                            </a>

                            <a href="#recursos">
                                Recursos
                            </a>

                            <a href="#tecnologia">
                                Tecnologia
                            </a>

                            <a href="#dev">
                                Desenvolvedor
                            </a>

                            <a
                                href="https://blabry.com.br/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Política de privacidade
                            </a>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <span>
                            © 2026 Blabry. Projeto pessoal de Abraão Santos.
                        </span>

                        <span className="mono">
                            feito com React, Node.js e Socket.io
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}