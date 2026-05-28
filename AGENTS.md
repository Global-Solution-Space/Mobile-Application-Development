# 🤖 AGENTS.md — Guia de Contexto para IA

Bem-vindo(a) ao projeto **Terra Nova**, agente! Este documento serve como base de conhecimento para que você entenda o contexto, as regras de negócio e a arquitetura do projeto atual, evitando alucinações e regressões no código.

---

## 1. Visão Geral do Projeto
**Terra Nova** é um aplicativo mobile focado em **Gestão Agrícola Inteligente e Coleta de Dados**. Ele permite que produtores rurais gerenciem estufas, lotes de cultivo, controle de estoque (insumos) e agendamento de tarefas. 
O aplicativo possui uma pegada altamente tecnológica, simulando **integração com dados de satélite** para emitir alertas climáticos e detectar anomalias biológicas (pragas) de forma antecipada.

> ⚠️ **REGRA CRÍTICA DE TEMA (O QUE NÃO FAZER):** 
> Anteriormente o projeto tinha uma temática espacial ("SIDONIA", "Astronautas", "Espaço", "Falta de Oxigênio"). **TUDO ISSO FOI REMOVIDO.** 
> **NUNCA** use termos de viagens espaciais ou ficção científica. Use sempre terminologia agronômica real (Produtor, Lote, Estufa, Trator, Praga, Seca, Análise Espectral por Satélite, etc).

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
4. **Estoque de Insumos:** CRUD de adubos, sementes, etc., com alerta de estoque mínimo.
5. **Estufas (Setores):** Monitoramento de sensores de luz, água e ocupação.
6. **Colheitas:** Relatório e histórico.
7. **Tarefas:** Agendamento com prioridades.
8. **Logs de Atividades:** Timeline de ações tomadas pelo usuário.

---

## 5. Próximos Passos (Integração com API Java)
O app está estruturalmente pronto para ser conectado a um Backend (API Java Spring Boot).
**Diretrizes para a integração:**
- **NÃO** altere a camada visual (UI/Telas).
- A integração acontecerá **exclusivamente** alterando as funções do `src/store/useAppStore.ts`.
- Substitua a manipulação de arrays locais por chamadas `axios.get`, `axios.post`, etc.
- Adicione gerenciamento de estado de carregamento (`isLoading: boolean`) na Store para dar feedback visual nas telas durante as requisições HTTP.
- O componente `<PrimaryButton />` já possui a prop `isLoading` pronta para exibir um spinner durante requisições.

---

## 6. Padrões de Código Exigidos
- **Componentização:** Sempre use os componentes de `src/components/` quando aplicável. Não duplique estilos de chips, inputs, badges ou empty states nas telas.
- **Validação de Números:** Nunca use `parseInt(x)` sozinho para validar campos obrigatórios numéricos, pois `" "` ou `"abc"` retornam `NaN` e quebram a loja. Use `isNaN(Number(x))` para validar strings.
- **Teclado (UX):** Sempre envolva formulários (Telas de Cadastro, Login, etc) com `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>` para o teclado não cobrir os inputs.
- **SafeArea:** Use `useSafeAreaInsets()` do `react-native-safe-area-context` para dar paddings dinâmicos (como feito no `Header`), evitando que a UI fique escondida atrás de Notches e Dynamic Islands.
- **Tema Agrícola:** Toda terminologia deve ser agronômica (Produtor, Lote, Estufa, Praga, Análise por Satélite). Nunca use termos espaciais.
