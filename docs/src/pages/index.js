import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="Blabry Docs"
      description="Documentação oficial do Blabry">
      <main className={styles.main}>
      <div className={styles.brand}>
        <img src="img/logo.svg" alt="Blabry" className={styles.logo} />
        <h1 className={styles.title}>Blabry</h1>
      </div>
        <p className={styles.tagline}>
          Explore a arquitetura, as decisões técnicas e o processo de desenvolvimento.
        </p>
        <Link
          className={styles.cta}
          to="/docs/modelo-3c">
          Acessar documentação
        </Link>
      </main>
    </Layout>
  );
}