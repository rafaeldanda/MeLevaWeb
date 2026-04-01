// ================= CONFIG =================
const URL_GPS = "https://primary-production-a103.up.railway.app/webhook/91e80c8e-2309-4dd4-8512-f0dc5c4af856";
const URL_LOGIN_MOTORISTA = "https://primary-production-a103.up.railway.app/webhook/c8e1d87a-8d76-4e09-ba33-d7c4888ad574";
const URL_LOGIN_PASSAGEIRO = "https://primary-production-a103.up.railway.app/webhook/eeb9a6ad-2361-4c4c-9a23-dd229e18ee9c";
const URL_CORRIDA = "https://primary-production-a103.up.railway.app/webhook/4a3ec249-66de-4148-bb53-8f45d18d1eef";

// 🔑 TOKEN MAPBOX
mapboxgl.accessToken = 'pk.eyJ1IjoicmFmYWVsZGFuZGEiLCJhIjoiY21tM3V6aHQ3MDR1dTJxcHdiNnhpaHd0ayJ9.w-fjeHmzlyVes75Rg4pJuQ';

// ================= VARIÁVEIS =================
let token = "MOTO-TESTE";
let ultimaPos = null;
let enviando = false;

// MAPA
let map = null;
let marker = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ App carregado");

    document.getElementById("btnMotorista")?.addEventListener("click", loginMotorista);
    document.getElementById("btnPassageiro")?.addEventListener("click", loginPassageiro);
    document.getElementById("btnCorrida")?.addEventListener("click", solicitarCorrida);
});


// ================= LOGIN MOTORISTA =================
async function loginMotorista() {

    console.log("🔵 Login motorista");

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {

        await fetch(URL_LOGIN_MOTORISTA, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({acao:"login", usuario, senha})
        });

        document.getElementById("login").classList.add("hidden");
        document.getElementById("motorista").classList.remove("hidden");

        iniciarMapa();   // 🔥 mapa
        iniciarGPS();    // 🔥 gps

    } catch (e) {
        console.error(e);
        alert("Erro no login motorista");
    }
}


// ================= LOGIN PASSAGEIRO =================
async function loginPassageiro() {

    console.log("🟢 Login passageiro");

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {

        await fetch(URL_LOGIN_PASSAGEIRO, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({usuario, senha})
        });

        document.getElementById("login").classList.add("hidden");
        document.getElementById("passageiro").classList.remove("hidden");

        // 🔥 espera renderizar a tela antes de criar o mapa
        setTimeout(iniciarMapa, 300);

    } catch (e) {
        console.error(e);
        alert("Erro no login passageiro");
    }
}


// ================= MAPA =================
function iniciarMapa() {

    if (!document.getElementById("map")) {
        console.warn("⚠️ DIV #map não encontrada");
        return;
    }

    console.log("🗺️ Iniciando mapa");

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-51.23, -30.03], // Porto Alegre
        zoom: 13
    });

    marker = new mapboxgl.Marker({ color: '#2ea6ff' })
        .setLngLat([-51.23, -30.03])
        .addTo(map);
}


// ================= GPS =================
function iniciarGPS() {

    if (!navigator.geolocation) {
        alert("GPS não suportado");
        return;
    }

    console.log("📡 GPS iniciado");

    navigator.geolocation.watchPosition(
        (pos) => {

            ultimaPos = pos;

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            console.log("📍 Posição:", lat, lon);

            // 🔥 atualiza mapa
            if (marker) marker.setLngLat([lon, lat]);
            if (map) map.setCenter([lon, lat]);

        },
        (err) => console.error("Erro GPS:", err),
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

            const lat = ultimaPos.coords.latitude;
            const lon = ultimaPos.coords.longitude;
            const speed = ultimaPos.coords.speed || 0;

            const url = `${URL_GPS}?token=${token}&lat=${lat}&lon=${lon}&speed=${speed}&ping=1`;

            console.log("📡 Enviando:", url);

            fetch(url).catch(e => console.error("Erro GPS:", e));

            const status = document.getElementById("statusGPS");
            if (status) status.innerText = "📍 GPS ativo";
        }

        setTimeout(loop, 10000);
    }

    loop();
}


// ================= CORRIDA =================
async function solicitarCorrida() {

    console.log("🚕 Nova corrida");

    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;

    let distancia = 10;
    let valor = distancia * 2.7;
    if (valor < 10) valor = 10;

    try {

        await fetch(URL_CORRIDA, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                nome: "Usuário",
                origem,
                destino,
                distancia_km: distancia,
                valor_total: valor
            })
        });

        alert("Corrida solicitada 🚕");

    } catch (e) {
        console.error(e);
        alert("Erro ao solicitar corrida");
    }
}
