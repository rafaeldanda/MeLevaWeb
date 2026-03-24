// ================= CONFIG =================
const URL_GPS = "https://primary-production-a103.up.railway.app/webhook/91e80c8e-2309-4dd4-8512-f0dc5c4af856";
const URL_LOGIN_MOTORISTA = "https://primary-production-a103.up.railway.app/webhook/c8e1d87a-8d76-4e09-ba33-d7c4888ad574";
const URL_LOGIN_PASSAGEIRO = "https://primary-production-a103.up.railway.app/webhook/eeb9a6ad-2361-4c4c-9a23-dd229e18ee9c";
const URL_CORRIDA = "https://primary-production-a103.up.railway.app/webhook/4a3ec249-66de-4148-bb53-8f45d18d1eef";

// ================= VARIÁVEIS =================
let token = "MOTO-TESTE";
let ultimaPos = null;
let enviando = false;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

```
console.log("✅ App carregado");

const btnMotorista = document.getElementById("btnMotorista");
const btnPassageiro = document.getElementById("btnPassageiro");
const btnCorrida = document.getElementById("btnCorrida");

if (btnMotorista) {
    btnMotorista.addEventListener("click", loginMotorista);
}

if (btnPassageiro) {
    btnPassageiro.addEventListener("click", loginPassageiro);
}

if (btnCorrida) {
    btnCorrida.addEventListener("click", solicitarCorrida);
}
```

});

// ================= LOGIN MOTORISTA =================
async function loginMotorista() {

```
console.log("🔵 Clique motorista");

const usuario = document.getElementById("usuario").value;
const senha = document.getElementById("senha").value;

console.log("Tentando login:", usuario, senha);

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

    document.getElementById("login").classList.add("hidden");
    document.getElementById("motorista").classList.remove("hidden");

    iniciarGPS();

} catch (e) {
    console.error("❌ ERRO LOGIN MOTORISTA:", e);
    alert("Erro ao conectar com servidor");
}
```

}

// ================= LOGIN PASSAGEIRO =================
async function loginPassageiro() {

```
console.log("🟢 Clique passageiro");

const usuario = document.getElementById("usuario").value;
const senha = document.getElementById("senha").value;

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

    console.log("STATUS:", res.status);

    const text = await res.text();
    console.log("RESPOSTA:", text);

    document.getElementById("login").classList.add("hidden");
    document.getElementById("passageiro").classList.remove("hidden");

} catch (e) {
    console.error("❌ ERRO LOGIN PASSAGEIRO:", e);
    alert("Erro ao conectar com servidor");
}
```

}

// ================= GPS =================
function iniciarGPS() {

```
if (!navigator.geolocation) {
    alert("GPS não suportado");
    return;
}

console.log("📡 Iniciando GPS...");

navigator.geolocation.watchPosition(
    (pos) => {
        ultimaPos = pos;
    },
    (err) => {
        console.error("Erro GPS:", err);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000
    }
);

loopEnvioGPS();
```

}

// ================= LOOP GPS =================
function loopEnvioGPS() {

```
if (enviando) return;

enviando = true;

async function enviarLoop() {

    if (ultimaPos) {

        const { latitude, longitude, speed } = ultimaPos.coords;

        console.log("📍 Enviando GPS:", latitude, longitude);

        try {
            await fetch(`${URL_GPS}?token=${token}&lat=${latitude}&lon=${longitude}&speed=${speed || 0}&ping=1`);
        } catch (e) {
            console.error("Erro envio GPS:", e);
        }

        document.getElementById("statusGPS").innerText = "📍 GPS enviado";
    }

    setTimeout(enviarLoop, 10000);
}

enviarLoop();
```

}

// ================= CORRIDA =================
async function solicitarCorrida() {

```
console.log("🚕 Solicitando corrida");

const origem = document.getElementById("origem").value;
const destino = document.getElementById("destino").value;

let distancia = 10;
let valor = distancia * 2.7;

if (valor < 10) valor = 10;

try {

    const res = await fetch(URL_CORRIDA, {
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

    console.log("STATUS CORRIDA:", res.status);

    alert("Corrida solicitada!");

} catch (e) {
    console.error("❌ ERRO CORRIDA:", e);
    alert("Erro ao solicitar corrida");
}
```

}
