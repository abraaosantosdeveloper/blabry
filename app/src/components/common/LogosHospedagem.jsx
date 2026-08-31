/**
 * Marcas dos serviços de infraestrutura citados na política de privacidade.
 *
 * ATENÇÃO: estes são selos-monograma DESENHADOS AQUI, não as logos oficiais.
 * As marcas oficiais (Railway, GitHub, Cloudinary, MySQL/Oracle, Resend) são
 * ativos protegidos e não estão no repositório. Cada uma tem regras próprias
 * de uso — normalmente exigem baixar o SVG do brand kit do fornecedor e
 * respeitar cor, espaçamento mínimo e proporção. Enquanto isso não é feito,
 * usamos um monograma neutro para não distribuir uma versão adulterada da
 * marca de terceiros, o que seria pior do que não exibi-la.
 *
 * Para trocar: baixe o SVG oficial, salve em src/assets/logos/<nome>.svg e
 * substitua o componente correspondente por <img src={...} />. A estrutura
 * do rodapé não muda.
 */

/* Cada serviço é descrito por dados, não por JSX repetido: assim o rodapé
   itera sobre uma lista e o desenho do selo é escrito uma única vez. */
export const SERVICOS = [
    {
        id: 'railway',
        name: 'Railway',
        sigla: 'RW',
        cor: '#8A6DF1',
        papel: 'Hospedagem da API e do banco de dados',
        site: 'https://railway.com',
    },
    {
        id: 'github',
        name: 'GitHub Pages',
        sigla: 'GH',
        cor: '#4A5568',
        papel: 'Hospedagem da interface web (arquivos estáticos)',
        site: 'https://pages.github.com',
    },
    {
        id: 'cloudinary',
        name: 'Cloudinary',
        sigla: 'CL',
        cor: '#2E7BEE',
        papel: 'Armazenamento e entrega das fotos de perfil',
        site: 'https://cloudinary.com',
    },
    {
        id: 'mysql',
        name: 'MySQL',
        sigla: 'My',
        cor: '#00758F',
        papel: 'Banco de dados relacional onde os registros ficam gravados',
        site: 'https://www.mysql.com',
    },
    {
        id: 'resend',
        name: 'Resend',
        sigla: 'Re',
        cor: '#1F2933',
        papel: 'Envio dos e-mails com códigos de verificação',
        site: 'https://resend.com',
    },
]

/**
 * Selo quadrado com o monograma do serviço.
 * @param {{sigla: string, cor: string}} props
 */
export function SeloServico({ sigla, cor }) {
    return (
        /* aria-hidden porque o nome do serviço já aparece como texto ao lado:
           anunciar "RW" no leitor de tela só repetiria a informação em pior
           qualidade. O selo é decoração de apoio ao name, não substituto. */
        <span className="selo-servico" style={{ '--selo-cor': cor }} aria-hidden="true">
            {sigla}
        </span>
    )
}
