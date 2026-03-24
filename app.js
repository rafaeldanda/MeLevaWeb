// ================= CONFIG =================
const URL_GPS = "https://primary-production-a103.up.railway.app/webhook/91e80c8e-2309-4dd4-8512-f0dc5c4af856";
const URL_LOGIN_MOTORISTA = "https://primary-production-a103.up.railway.app/webhook/c8e1d87a-8d76-4e09-ba33-d7c4888ad574";
const URL_LOGIN_PASSAGEIRO = "https://primary-production-a103.up.railway.app/webhook/eeb9a6ad-2361-4c4c-9a23-dd229e18ee9c";
const URL_CORRIDA = "https://primary-production-a103.up.railway.app/webhook/4a3ec249-66de-4148-bb53-8f45d18d1eef";

let token = "MOTO-TESTE";
let ultimaPos = null;

// ================= EVENTOS =================
document.addEventListener("DOMContentLoaded", () => {
document.getElementById("btnMotorista").addEventListener("click", loginMotorista);
document.getElementById("btnPassageiro").addEventListener("click", loginPassageiro);
document.getElementById("btnCorrida").addEventListener("click", solicitarCorrida);
});

// ================= LOGIN MOTORISTA =================
async function loginMotorista() {

```
const usuario = document.getElementById("usuario").value;
const senha = document.getElementById("senha").value;

console.log("Tentando login motorista:", usuario, senha);

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

    const text = await res.text();
    console.log("Resposta servidor:", text);

    document.getElementById("login").classList.add("hidden");
    document.getElementById("motorista").classList.remove("hidden");

    iniciarGPS();

} catch (e) {
    console.error("Erro login motorista:", e);
    alert("Erro ao conectar com servidor");
}
```

}

// ================= LOGIN PASSAGEIRO =================
async function loginPassageiro() {

```
const usuario = document.getElementById("usuario").value;
const senha = document.getElementById("senha").value;

console.log("Tentando login passageiro:", usuario, senha);

try {
    const res = await fetch(URL_LOGIN_PASSAGEIRO, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            senha
        })
    });

    const text = await res.text();
    console.log("Resposta servidor:", text);

    document.getElementById("login").classList.add("hidden");
    document.getElementById("passageiro").classList.remove("hidden");

} catch (e) {
    console.error("Erro login passageiro:", e);
    alert("Erro ao conectar com servidor");
}
```

}

// ================= GPS =================
function iniciarGPS() {

```
if (!navigator.geolocation) {
    alert("GPS não disponível");
    return;
}

navigator.geolocation.watchPosition((pos) => {
    ultimaPos = pos;
});

setInterval(() => {

    if (!ultimaPos) return;

    const { latitude, longitude, speed } = ultimaPos.coords;

    console.log("Enviando GPS:", latitude, longitude);

    fetch(`${URL_GPS}?token=${token}&lat=${latitude}&lon=${longitude}&speed=${speed || 0}&ping=1`);

    document.getElementById("statusGPS").innerText = "📍 GPS enviado";

}, 60000);
```

}

// ================= CORRIDA =================
async function solicitarCorrida() {

```
const origem = document.getElementById("origem").value;
const destino = document.getElementById("destino").value;

let distancia = 10;
let valor = distancia * 2.7;

if (valor < 10) valor = 10;

console.log("Solicitando corrida...");

try {
    await fetch(URL_CORRIDA, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: "Usuário",
            origem,
            destino,
            distancia_km: distancia,
            valor_total: valor
        })
    });

    alert("Corrida solicitada!");

} catch (e) {
    console.error("Erro corrida:", e);
    alert("Erro ao solicitar corrida");
}
```

}
