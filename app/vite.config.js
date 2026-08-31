import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

/**
 * O GitHub Pages é hospedagem estática: ao recarregar uma rota interna como
 * /blabry/perfil/me, ele procura um arquivo nesse caminho e responde 404.
 *
 * A saída é publicar o mesmo index.html como 404.html. O Pages entrega essa
 * página para qualquer caminho desconhecido mantendo a URL na barra, e o
 * React Router então renderiza a tela correspondente.
 *
 * Feito por plugin, e não por um "cp" no script de build, para funcionar
 * igual no Windows e no Linux.
 */
function copiaIndexPara404() {
  return {
    name: 'copia-index-para-404',
    closeBundle() {
      const saida = resolve(__dirname, 'dist')
      copyFileSync(resolve(saida, 'index.html'), resolve(saida, '404.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), svgr(), copiaIndexPara404()],
  base: '/blabry/',
})
