import { Semaphore } from "npm:async-mutex";

const N = 5;
const RODADAS = 3;

const garfos = Array.from({ length: N }, () => new Semaphore(1));

const mesa = new Semaphore(N - 1);

const dormir = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const tempoAleatorio = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function pensar(id: number) {
    const duracao = tempoAleatorio(1000, 3000);
    console.log(`Filósofo ${id} está PENSANDO por ${(duracao / 1000).toFixed(1)}s`);
    await dormir(duracao);
}

async function comer(id: number) {
    const duracao = tempoAleatorio(1000, 2000);
    console.log(`Filósofo ${id} está COMENDO por ${(duracao / 1000).toFixed(1)}s`);
    await dormir(duracao);
}

async function filosofo(id: number, rodadas: number) {
    const esquerdo = id;
    const direito = (id + 1) % N;

    for (let rodada = 1; rodada <= rodadas; rodada++) {
        await pensar(id);

        console.log(`Filósofo ${id} (rodada ${rodada}): quer comer, aguardando lugar na mesa...`);
        
        const [, releaseMesa] = await mesa.acquire();

        const [, releaseEsquerdo] = await garfos[esquerdo].acquire();
        console.log(`Filósofo ${id}: pegou garfo esquerdo (${esquerdo})`);

        await dormir(900);

        const [, releaseDireito] = await garfos[direito].acquire();
        console.log(`Filósofo ${id}: pegou garfo direito (${direito})`);

        await comer(id);

        releaseDireito();
        releaseEsquerdo();
        releaseMesa();
        
        console.log(`Filósofo ${id}: devolveu os garfos e liberou a mesa`);
    }
}

console.log("=== Jantar dos Filósofos iniciado ===\n");

const tarefas = [];
for (let i = 0; i < N; i++) {
    tarefas.push(filosofo(i, RODADAS));
}

await Promise.all(tarefas);

console.log("\n=== Jantar encerrado ===");