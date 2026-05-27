# PROJETO SIDONIA: Arquitetura e Especificação Técnica

Este documento define a arquitetura, as regras de negócio e o roadmap para o desenvolvimento do aplicativo mobile SIDONIA. Ele servirá como o nosso "Norte" (Single Source of Truth) para o projeto.

## 1. Visão Geral
**SIDONIA** é uma plataforma inteligente focada 100% no planejamento, monitoramento e otimização de viagens interplanetárias para humanos. 
*   **A Abordagem (Simulador Operacional):** O sistema atua como um simulador logístico com gameplay sistêmico focado nas entranhas da missão espacial. O usuário não insere dados "fictícios", mas sim parâmetros de voo e gerenciamento de tripulação que passam por um motor de validação matemático rigoroso e sofrem degradação contínua no vácuo espacial.
*   **Aplicação na Global Solution:** Foco total na fronteira mais extrema da exploração: garantir a sobrevivência humana, gerenciando módulos da nave, suporte à vida e rotas interplanetárias (ex: Terra -> Marte).

---

## 2. A "Engine" e Lógica de Negócio (O Coração do App)

A lógica central do SIDONIA será implementada em funções puras TypeScript e gerenciada via **Zustand**. A nave não é um objeto estático, mas um "ecossistema vivo".

### 2.1. Entidades de Domínio (Types/Interfaces)
```typescript
interface ShipModule {
  id: string;
  name: string;
  type: 'LIFE_SUPPORT' | 'ENGINE' | 'COMMUNICATION' | 'ENERGY' | 'NAVIGATION' | 'CARGO';
  health: number; // 0-100 (Degradação)
  energyConsumption: number;
  status: 'ONLINE' | 'OFFLINE' | 'DAMAGED';
}

interface Vehicle {
  id: string;
  name: string;
  type: 'SPACECRAFT' | 'ORBITAL_STATION' | 'LANDER';
  maxCrew: number;
  maxPayloadKg: number;
  maxFuelLiters: number;
  fuelConsumptionPerKm: number; // Eficiência base
  speedKmh: number;
  modules: ShipModule[]; // A Nave é composta por módulos que podem falhar
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  weightKg: number;
  oxygenConsumptionPerDay: number; // L/dia
  waterConsumptionPerDay: number; // L/dia
  foodConsumptionPerDay: number; // kg/dia
}

interface TelemetryEvent {
  id: string;
  timestamp: Date;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  source: string; // Ex: 'ENGINE', 'LIFE_SUPPORT'
  message: string;
}

interface MissionParameters {
  vehicleId: string;
  destinationName: string;
  distanceKm: number;
  crew: CrewMember[];
  payloadKg: number;
  fuelLoadedLiters: number;
  oxygenLoadedLiters: number;
  waterLoadedLiters: number;
  foodLoadedKg: number;
}

interface ValidationResult {
  status: 'APPROVED' | 'WARNING' | 'REJECTED';
  reliabilityScore: number; // 0-100%
  estimatedDurationDays: number;
  fuelStatus: 'OK' | 'WARNING' | 'CRITICAL';
  oxygenStatus: 'OK' | 'WARNING' | 'CRITICAL';
  payloadStatus: 'OK' | 'EXCEEDED';
  messages: string[]; // Ex: "Peso excede o limite em 2.4 toneladas."
}
```

### 2.2. A Matemática (Fórmulas do Simulador)
Para transformar o app em uma ferramenta séria:

1.  **Consumo Base Dinâmico:** Se a `health` de um módulo cai, o `energyConsumption` sobe.
2.  **Eficiência Operacional:** `Carga Útil / Consumo Total`
3.  **Índice de Risco:** `Consumo Estimado / Recursos Disponíveis`
4.  **MISSION RELIABILITY SCORE:** 
    `Score = Autonomia + Margem de Combustível + Redundância + Estabilidade dos Módulos`
    *(Ex: Score abaixo de 60% = Missão Suicida).*
5.  **Degradação pelo Peso:** Quanto maior a carga extra, maior o estresse estrutural e consumo de combustível.

---

## 3. Mapeamento de Telas (UX/UI Flow Visceral)

A estética será baseada em painéis de controle reais (SpaceX, Dead Space, Interstellar). **NADA DE CARDS GIGANTES DE FINTECH.** O foco é densidade de dados, mini-gráficos, grades hexagonais, linhas técnicas, números monoespaçados, radar sweep e glow suave.

### Tela 1: Dashboard Principal (Global View)
*   **Painéis Compactos:** Mapa orbital/topográfico, ETA, Temperatura Interna, Pressão.
*   **Event Stream (Rodapé):** Logs de telemetria passando em tempo real (estilo terminal).
*   **Mini-gráficos:** Consumo energético em tempo real oscilando.

### Tela 2: Setup da Missão (Simulação Real-time)
*   **Sliders de Recursos:** Ao mover um slider, a *Mission Reliability Score* recalcula na hora. O peso afeta o consumo visualmente.
*   **Visão Modular:** Mostrar a nave e o estresse que a carga escolhida vai causar no módulo `ENGINE`.

### Tela 3: Mission Report (Análise de Risco)
*   **Score Principal:** Ex: `MISSION RELIABILITY SCORE: 87%` pulsando na tela.
*   **Grids Técnicos:** Tabelas e diagramas densos mostrando onde estão os gargalos.
*   **Risco Composto:** Alertas como "Risco de falha no suporte de vida excede 15%".

### Tela 4: Active Telemetry (Mission Control - O Ouro)
*   **Layout HUD:**
    *   *Esquerda:* Resumo crítico dos módulos e temperatura.
    *   *Centro:* Radar sweep, trajetória orbital, posição espacial.
    *   *Direita:* Barras verticais de recursos (O2, H2O), alertas de sistema.
    *   *Rodapé:* Console de log injetando `TelemetryEvent` ("Vazamento de oxigênio detectado...").

### Tela 5: Engineering Bay (Diagnóstico da Nave) - Nova Tela p/ CRUD
*   **Foco 100% na Nave:** Em vez de frotas, o usuário gerencia o "coração" da nave atual. 
*   **Ações (CRUD):** Visualiza a saúde de cada `ShipModule` (Suporte de Vida, Propulsores, etc.). Permite alocar energia extra para um módulo (Update), desligar módulos não-críticos para economizar energia (Delete/Disable) ou iniciar reparos.

---

## 4. Estrutura do Código

```text
src/
 ┣ components/         # Reutilizáveis
 ┃ ┣ HexGrid.tsx       # Grade técnica de fundo
 ┃ ┣ MonoText.tsx      # Texto monoespaçado para números vivos
 ┃ ┣ RadarSweep.tsx    # Animação central
 ┃ ┗ LogStream.tsx     # Terminal de eventos
 ┣ routes/
 ┃ ┗ MainDrawer.tsx     # Drawer Navigation (Menu Lateral)
 ┣ screens/
 ┃ ┣ Dashboard/        
 ┃ ┣ MissionSetup/     
 ┃ ┣ MissionReport/    
 ┃ ┣ ActiveTelemetry/  
 ┃ ┗ EngineeringBay/   # Tela 5 (Gestão interna da nave)
 ┣ store/
 ┃ ┗ missionStore.ts   # Zustand (Estado Global + Simulador de Degradação)
 ┣ theme/
 ┃ ┗ colors.ts         # Cores técnicas (Cyan, Orange Warning, Neon Green)
 ┗ utils/
   ┗ engine.ts         # Motor matemático (Score, Eficiência, Degradação)
```

---

## 5. Plano de Execução Imediato (Passo a Passo Prático)

1.  **Fase 1: Infraestrutura e Ferramentas (Lint/Prettier):**
    *   Garantir código limpo e dentro das normas do professor.
2.  **Fase 2: Estrutura de Navegação (Drawer):**
    *   A navegação será feita via `@react-navigation/drawer`, criando um menu lateral "tático" de opções. O design terá uma estética "Premium Sci-Fi / High-Tech".
3.  **Fase 3: A Engine (Math & Zustand):**
    *   Programar `engine.ts` com as fórmulas de Risco, Degradação e Score.
    *   Configurar `missionStore.ts` com a nave modular e eventos.
4.  **Fase 4: Mission Setup e Hangar:**
    *   Construir a tela de Setup com recalculo visual em tempo real do Score.
5.  **Fase 5: Mission Control HUD e Engineering Bay:**
    *   Construir o layout denso da tela de telemetria com radar e a tela de diagnóstico da nave (CRUD de Módulos).
