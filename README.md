# Atividade 1.2: Concorrência e Sincronização em TypeScript

Implementação do problema clássico do **Jantar dos Filósofos** utilizando TypeScript (Deno) e a biblioteca `async-mutex`. O objetivo é demonstrar a exclusão mútua e a prevenção de *deadlocks* através de semáforos assíncronos.

## Pré-requisitos

* Docker

## Como executar

Na raiz do projeto, execute o comando abaixo para construir e iniciar o container:

**1. Construção da imagem:**
```bash
docker build -t jantar-ts ./filosofos
```

**2. Execução:**
```bash
docker run --rm jantar-ts
```

## Sobre a Implementação

O projeto utiliza a biblioteca `async-mutex` para implementar semáforos assíncronos, essenciais para o modelo *Single-Threaded* (Event Loop) do TypeScript. 

* **Exclusão Mútua:** Cada garfo é um semáforo de capacidade 1, garantindo que apenas um filósofo possa utilizá-lo por vez.
* **Prevenção de Deadlock:** Foi implementado um semáforo limitador para a mesa, permitindo que, no máximo, $N-1$ filósofos tentem adquirir garfos simultaneamente. Isso quebra a condição de **Espera Circular**, eliminando o risco de impasses (*deadlocks*).
