# 🤖 AGENTS.md — Guia de Contexto para IA

O Terra Nova é uma plataforma de agricultura inteligente baseada em análise satelital e monitoramento geoespacial de lavouras.

A solução utiliza dados simulados de satélite, sensores e análise ambiental para acompanhar em tempo real a saúde agrícola de diferentes lotes de cultivo, auxiliando produtores rurais na tomada de decisão.

O sistema identifica anomalias como estresse hídrico, risco de pragas, baixa fertilidade e variações climáticas, emitindo alertas automáticos e recomendações preventivas para aumentar a produtividade e reduzir perdas agrícolas.

Inspirado em tecnologias utilizadas na economia espacial e no sensoriamento remoto, o Terra Nova conecta inovação tecnológica, agronegócio e inteligência de dados em uma solução moderna de agricultura de precisão.


---

## 1. Visão Geral do Projeto
**Terra Nova** é um aplicativo mobile focado em **Gestão Agrícola Inteligente e Coleta de Dados**. Ele permite que produtores rurais gerenciem estufas, lotes de cultivo, controle de estoque (insumos) e agendamento de tarefas. 
O aplicativo possui uma pegada altamente tecnológica, simulando **integração com dados de satélite** para emitir alertas climáticos e detectar anomalias biológicas (pragas) de forma antecipada.

---

## 2. Tech Stack
- **Framework:** React Native + Expo
- **Linguagem:** TypeScript (Tipagem forte obrigatória)
- **Navegação:** React Navigation (Native Stack + Bottom Tabs, tipado com `RootStackParamList`)
- **Gerenciamento de Estado:** Zustand (com persistência via `AsyncStorage` usando middleware `persist`)
- **Estilização:** StyleSheet nativo + UI/UX baseada no arquivo `src/theme/colors.ts` (Dark Theme moderno e high-tech).
- **Ícones:** `@expo/vector-icons` (FontAwesome5)

---

## 3. Arquitetura e Estrutura
O projeto segue uma separação clara de responsabilidades:

### Dados & Estado
- **`src/types/index.ts`**: Contém todos os DTOs, interfaces e `RootStackParamList`. Fonte de verdade para a estrutura dos dados.
- **`src/store/useAppStore.ts`**: Coração do app. Centraliza todo o CRUD de Lotes, Insumos, Usuários e Logs usando Zustand. Persistência real via `AsyncStorage` (key: `terranova-storage`).

### Componentes Reutilizáveis (`src/components/`)
Componentes burros e desacoplados. **Sempre prefira usá-los ao invés de recriar estilos inline nas telas:**

| Componente | Descrição | Props principais |
|---|---|---|
| `<Header />` | Cabeçalho adaptativo com `useSafeAreaInsets()` | `title` |
| `<EmptyState />` | Placeholder para FlatLists vazias (ícone + texto) | `icon`, `title`, `subtitle?` |
| `<FormInput />` | Input com ícone lateral e suporte a eye toggle | `iconName`, `rightIcon?`, `onRightIconPress?` + TextInputProps |
| `<PrimaryButton />` | Botão principal com loading spinner para API | `title`, `icon?`, `onPress`, `isLoading?`, `disabled?` |
| `<SelectChip />` | Pílula selecionável para filtros/formulários | `label`, `emoji?`, `isActive`, `onPress`, `activeColor?` |
| `<StatusBadge />` | Badge com dot colorido (Saudável/Crítico/etc) | `label`, `variant` (success/warning/danger/info) |
| `<SuccessToast />` | Feedback visual temporário de sucesso | `message`, `visible` |

### Telas (`src/screens/`)
Telas isoladas por funcionalidade. Nenhum acesso direto a banco ou requisições aqui — as telas apenas consomem métodos e variáveis do `useAppStore`.

### Navegação (`src/routes/`)
- **`MainStack.tsx`**: Stack tipada com `RootStackParamList`. Fluxo condicional Auth / App.
- **`TabRoutes.tsx`**: Bottom Tabs com Home, Lotes, Cadastro, Estoque e Perfil.

---

## 4. Funcionalidades Implementadas (100% Concluídas)
1. **Autenticação:** Login e Registro (Auth condicional no `MainStack`).
2. **Dashboard (Home):** Exibição de KPIs e botão de simulação de "Eventos Críticos" que puxa alertas de satélite simulados.
3. **Lotes de Cultivo:** CRUD completo + Filtros avançados por cultura e status.
4. **Estoque de Insumos:** CRUD de adubos, sementes, etc., com alerta de estoque mínimo. Compatibilidade total de nomenclatura (`tipo` e `quantidadeMinima` vs `categoria` e `minimo`).
5. **Estufas (Setores):** Monitoramento de sensores de luz, água e ocupação.
6. **Colheitas:** Relatório e histórico.
7. **Tarefas:** Agendamento com prioridades.
8. **Logs de Atividades:** Timeline de ações tomadas pelo usuário.
9. **Histórico de Irrigação (Novo):** Registro de quantidade (ml), data/hora e tipo de acionamento (Manual/Automático) por lote.

---

## 5. Integração com API Java (Pronto & Estruturado)
O aplicativo está 100% preparado e pré-conectado à API Java Spring Boot:
* **Cliente HTTP:** Axios instalado e configurado em `src/store/useAppStore.ts` com timeout e baseURL direcionados à API Java (`http://localhost:8080/api`).
* **Operações Assíncronas:** Todas as ações do store (`login`, `register`, `addLote`, `addInsumo`, etc.) foram convertidas para `async/await` com tratamento de exceções.
* **Feedback de Carregamento:** O estado `isLoading` foi inserido no store global. Botões e formulários mostram spinners de progresso durante as requisições HTTP.
* **Arquitetura Offline-First (Fallback):** As requisições possuem tratamento com fallback para o estado local e persistência em `AsyncStorage` se a API estiver offline ou inacessível. O desenvolvedor precisa apenas descomentar as linhas de código com chamadas Axios para ativar a integração ponta a ponta.

---

## 6. Padrões de Código Exigidos
- **Componentização:** Sempre use os componentes de `src/components/` quando aplicável. Não duplique estilos de chips, inputs, badges ou empty states nas telas.
- **Validação de Números:** Nunca use `parseInt(x)` sozinho para validar campos obrigatórios numéricos, pois `" "` ou `"abc"` retornam `NaN` e quebram a loja. Use `isNaN(Number(x))` para validar strings.
- **Teclado (UX):** Sempre envolva formulários (Telas de Cadastro, Login, etc) com `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>` para o teclado não cobrir os inputs.
- **SafeArea:** Use `useSafeAreaInsets()` do `react-native-safe-area-context` para dar paddings dinâmicos (como feito no `Header`), evitando que a UI fique escondida atrás de Notches e Dynamic Islands.
- **Tema Agrícola:** Toda terminologia deve ser agronômica (Produtor, Lote, Estufa, Praga, Análise por Satélite). Nunca use termos espaciais.
