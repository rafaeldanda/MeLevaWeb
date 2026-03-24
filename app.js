console.log("JS CARREGOU");

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM OK");

    const btn = document.getElementById("btnMotorista");

    console.log("Botão encontrado:", btn);

    btn.addEventListener("click", () => {
        console.log("🔥 CLIQUE FUNCIONOU 🔥");
        alert("Botão funcionando");
    });

});
