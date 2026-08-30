import { useEffect, useRef, useState } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Modal from '../modals/Modal'
import './PhotoCrop.css'

const LADO_FINAL = 320

const FotoIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z"
            stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
)

/**
 * Seleção e recorte da foto de perfil.
 * O recorte acontece dentro de um modal: só é confirmado no "Concluir",
 * e "Cancelar" descarta a seleção sem alterar a foto anterior.
 */
function PhotoCrop({ onCortar }) {
    const [origem, setOrigem] = useState(null)      // dataURL da imagem escolhida
    const [corte, setCorte] = useState()            // seleção em porcentagem
    const [cortePx, setCortePx] = useState(null)    // seleção em pixels
    const [previa, setPrevia] = useState(null)      // objectURL do recorte confirmado
    const imgRef = useRef(null)
    const entradaRef = useRef(null)

    // Libera o objectURL anterior para não vazar memória.
    useEffect(() => () => { if (previa) URL.revokeObjectURL(previa) }, [previa])

    function selecionar(e) {
        const arquivo = e.target.files?.[0]
        if (!arquivo) return

        const leitor = new FileReader()
        leitor.onload = () => setOrigem(leitor.result)
        leitor.readAsDataURL(arquivo)

        // Permite escolher o mesmo arquivo de novo depois de cancelar.
        e.target.value = ''
    }

    function aoCarregar(e) {
        const { width, height } = e.currentTarget
        setCorte(centerCrop(makeAspectCrop({ unit: '%', width: 80 }, 1, width, height), width, height))
    }

    function fechar() {
        setOrigem(null)
        setCorte(undefined)
        setCortePx(null)
    }

    function concluir() {
        const img = imgRef.current
        if (!img || !cortePx?.width) return

        const escalaX = img.naturalWidth / img.width
        const escalaY = img.naturalHeight / img.height

        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = LADO_FINAL
        canvas.getContext('2d').drawImage(
            img,
            cortePx.x * escalaX, cortePx.y * escalaY,
            cortePx.width * escalaX, cortePx.height * escalaY,
            0, 0, LADO_FINAL, LADO_FINAL
        )

        canvas.toBlob((blob) => {
            if (!blob) return
            setPrevia((anterior) => {
                if (anterior) URL.revokeObjectURL(anterior)
                return URL.createObjectURL(blob)
            })
            onCortar(blob)
            fechar()
        }, 'image/jpeg', 0.9)
    }

    function remover() {
        setPrevia((anterior) => {
            if (anterior) URL.revokeObjectURL(anterior)
            return null
        })
        onCortar(null)
    }

    return (
        <div className="photo-crop">
            {previa ? (
                <>
                    <img className="photo-previa" src={previa} alt="Prévia da foto de perfil" />
                    <div className="photo-previa-acoes">
                        <button type="button" className="photo-link" onClick={() => entradaRef.current?.click()}>
                            Trocar foto
                        </button>
                        <button type="button" className="photo-link perigo" onClick={remover}>
                            Remover
                        </button>
                    </div>
                </>
            ) : (
                <button type="button" className="photo-drop" onClick={() => entradaRef.current?.click()}>
                    <span className="photo-drop-circulo">+</span>
                    <span className="photo-drop-texto">Escolher uma foto</span>
                </button>
            )}

            <input
                id="foto-input"
                ref={entradaRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={selecionar}
                hidden
            />

            <Modal aberto={Boolean(origem)} aoFechar={fechar} rotulo="Recortar foto">
                <div className="photo-modal">
                    <p className="photo-modal-titulo">Ajuste sua foto</p>

                    <div className="photo-modal-area">
                        <ReactCrop
                            crop={corte}
                            onChange={(px, porcento) => { setCorte(porcento); setCortePx(px) }}
                            onComplete={(px) => setCortePx(px)}
                            aspect={1}
                            circularCrop
                            keepSelection
                        >
                            <img ref={imgRef} src={origem} alt="Foto selecionada" onLoad={aoCarregar} />
                        </ReactCrop>
                    </div>

                    <div className="photo-modal-acoes">
                        <button type="button" className="photo-botao secundario" onClick={fechar}>
                            Cancelar
                        </button>
                        <button type="button" className="photo-botao" onClick={concluir} disabled={!cortePx?.width}>
                            <FotoIcon aria-hidden="true" />
                            Concluir
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default PhotoCrop;
