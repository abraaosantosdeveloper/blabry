function Feed() {
    const nome = localStorage.getItem('nome')

    return (
        <div>
            <h1>Olá, {nome}!</h1>
        </div>
    )
}

export default Feed