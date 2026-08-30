import { useRef, useState } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './PhotoCrop.css'

const LADO_FINAL = 320

function PhotoCrop({ onCortar }) {
    const [origem, setOrigem] = useState(null)
    const [corte, setCorte] = useState()
    const imgRef = useRef(null)

    function selecionar(e) {
        const arquivo = e.target.files?.[0]
        if (!arquivo) return
        const leitor = new FileReader()
        leitor.onload = () => { setOrigem(leitor.result); onCortar(null) }
        leitor.readAsDataURL(arquivo)
    }

    function aoCarregar(e) {
        const { width, height } = e.currentTarget
        setCorte(centerCrop(makeAspectCrop({ unit: '%', width: 80 }, 1, width, height), width, height))
    }

    function gerar(cortePx) {
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
        canvas.toBlob((blob) => onCortar(blob), 'image/jpeg', 0.9)
    }

    return (
        <div className="photo-crop">
            {origem ? (
                <ReactCrop
                    crop={corte}
                    onChange={(_, porcento) => setCorte(porcento)}
                    onComplete={gerar}
                    aspect={1}
                    circularCrop
                    keepSelection
                >
                    <img ref={imgRef} src={origem} alt="Prévia da foto" onLoad={aoCarregar} />
                </ReactCrop>
            ) : (
                <label className="photo-drop" htmlFor="foto-input">
                    <span className="photo-drop-circulo">+</span>
                    <span className="photo-drop-texto">Escolher uma foto</span>
                </label>
            )}

            <input id="foto-input" type="file" accept="image/*" onChange={selecionar} hidden />

            {origem && (
                <label className="photo-trocar" htmlFor="foto-input">Trocar foto</label>
            )}
        </div>
    )
}

export default PhotoCrop
