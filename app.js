console.log("DISPARANDO FETCH...");

try {

    const res = await fetch(URL_LOGIN_MOTORISTA, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            acao: "login",
            usuario,
            senha
        })
    });

    console.log("STATUS:", res.status);

    const text = await res.text();
    console.log("RESPOSTA:", text);

} catch (e) {
    console.error("ERRO FETCH:", e);
}
