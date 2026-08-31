/**
 * Janela em que o autor ainda pode editar o que publicou.
 *
 * O mesmo valor existe no servidor, que é quem realmente decide. Aqui ele
 * serve só para não oferecer um botão que a API vai recusar — esconder a
 * opção é conveniência, não regra de segurança.
 */
export const JANELA_MINUTOS = 15
const JANELA_MS = JANELA_MINUTOS * 60 * 1000

export function dentroDaJanela(criadoEm) {
    const criado = new Date(criadoEm).getTime()
    if (Number.isNaN(criado)) return false
    return Date.now() - criado <= JANELA_MS
}
