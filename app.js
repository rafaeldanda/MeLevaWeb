// ================= CONFIG =================
const URL_GPS = "https://primary-production-a103.up.railway.app/webhook/91e80c8e-2309-4dd4-8512-f0dc5c4af856";
const URL_LOGIN_MOTORISTA = "https://primary-production-a103.up.railway.app/webhook/c8e1d87a-8d76-4e09-ba33-d7c4888ad574";
const URL_LOGIN_PASSAGEIRO = "https://primary-production-a103.up.railway.app/webhook/eeb9a6ad-2361-4c4c-9a23-dd229e18ee9c";
const URL_CORRIDA = "https://primary-production-a103.up.railway.app/webhook/4a3ec249-66de-4148-bb53-8f45d18d1eef";

// ================= VARIÁVEIS =================
let token = "MOTO-TESTE";
let ultimaPos = null;
let enviando = false;

// 🔥 MAPA
let map = null;
let markerMotorista = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ App carregado");

    const btnMotorista = document.getElementById("btnMotorista");
    const btnPassageiro = document.getElementById("btnPassageiro");
    const btnCorrida = document.getElementById("btnCorrida");

    if (btnMotorista) btnMotorista.addEventListener("click", loginMotorista);
    if (btnPassageiro) btnPassageiro.addEventListener("click", loginPassageiro);
    if (btnCorrida) btnCorrida.addEventListener("click", solicitarCorrida);
});

// ================= LOGIN MOTORISTA =================
async function loginMotorista() {

    console.log("🔵 Login motorista clicado");

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {

        const payload = {
            acao: "login",
            usuario,
            senha
        };

        const res = await fetch(URL_LOGIN_MOTORISTA, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        console.log("RESPOSTA:", text);

        document.getElementById("login").classList.add("hidden");
        document.getElementById("motorista").classList.remove("hidden");

        iniciarMapa();   // 🔥 inicia mapa
        iniciarGPS();    // 🔥 inicia GPS

    } catch (e) {
        console.error("❌ ERRO LOGIN MOTORISTA:", e);
        alert("Erro ao conectar com servidor");
    }
}

// ================= LOGIN PASSAGEIRO =================
async function loginPassageiro() {

    console.log("🟢 Login passageiro clicado");

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {

        const payload = { usuario, senha };

        const res = await fetch(URL_LOGIN_PASSAGEIRO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        console.log("RESPOSTA:", text);

        document.getElementById("login").classList.add("hidden");
        document.getElementById("passageiro").classList.remove("hidden");

    } catch (e) {
        console.error("❌ ERRO LOGIN PASSAGEIRO:", e);
        alert("Erro ao conectar com servidor");
    }
}

// ================= MAPA =================
function iniciarMapa() {

    mapboxgl.accessToken = 'pk.eyJ1IjoicmFmYWVsZGFuZGEiLCJhIjoiY21tM3V6aHQ3MDR1dTJxcHdiNnhpaHd0ayJ9.w-fjeHmzlyVes75Rg4pJuQ';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-51.23, -30.03],
        zoom: 12
    });

    markerMotorista = new mapboxgl.Marker({ color: '#2ea6ff' })
        .setLngLat([-51.23, -30.03])
        .addTo(map);
}

// ================= GPS =================
function iniciarGPS() {

    if (!navigator.geolocation) {
        alert("GPS não suportado");
        return;
    }

    console.log("📡 Iniciando GPS");

    navigator.geolocation.watchPosition(
        function (pos) {

            ultimaPos = pos;

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            // 🔥 atualiza mapa
            if (markerMotorista) markerMotorista.setLngLat([lon, lat]);
            if (map) map.setCenter([lon, lat]);
        },
        function (err) {
            console.error("Erro GPS:", err);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 20000
        }
    );

    iniciarLoopGPS();
}

// ================= LOOP GPS =================
function iniciarLoopGPS() {

    if (enviando) return;

    enviando = true;

    function loop() {

        if (ultimaPos) {

            const latitude = ultimaPos.coords.latitude;
            const longitude = ultimaPos.coords.longitude;
            const speed = ultimaPos.coords.speed || 0;

            const url =
                URL_GPS +
                "?token=" + token +
                "&lat=" + latitude +
                "&lon=" + longitude +
                "&speed=" + speed +
                "&ping=1";

            console.log("📍 Enviando GPS:", url);

            fetch(url).catch(e => console.error("Erro GPS:", e));

            const statusEl = document.getElementById("statusGPS");
            if (statusEl) statusEl.innerText = "📍 GPS ativo";
        }

        setTimeout(loop, 10000);
    }

    loop();
}

// ================= CORRIDA =================
async function solicitarCorrida() {

    console.log("🚕 Solicitar corrida");

    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;

    let distancia = 10;
    let valor = distancia * 2.7;
    if (valor < 10) valor = 10;

    try {

        const payload = {
            nome: "Usuário",
            origem,
            destino,
            distancia_km: distancia,
            valor_total: valor
        };

        console.log("Enviando corrida:", payload);

        const res = await fetch(URL_CORRIDA, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log("STATUS CORRIDA:", res.status);

        alert("Corrida solicitada!");

    } catch (e) {
        console.error("❌ ERRO CORRIDA:", e);
        alert("Erro ao solicitar corrida");
    }
}
