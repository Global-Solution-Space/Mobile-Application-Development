# 🤖 AGENTS.md — Guia de Contexto para IA

O Terra Nova é uma plataforma de agricultura inteligente baseada em monitoramento via satélite e análise geoespacial de lavouras.

A solução utiliza dados de satélite para acompanhar em tempo real a saúde agrícola de diferentes **Talhões** em múltiplas **Propriedades**, auxiliando **Produtores** rurais na tomada de decisão.

O sistema identifica anomalias como estresse hídrico, risco de pragas, baixa fertilidade e variações climáticas, emitindo **Alertas** automáticos e recomendações preventivas para aumentar a produtividade e reduzir perdas agrícolas.

Inspirado nas inovações Agrotech e de sensoriamento remoto, o Terra Nova conecta tecnologia, agronegócio e inteligência de dados em uma solução moderna de agricultura de precisão.

---

## 1. Visão Geral do Projeto
**Terra Nova** é um aplicativo mobile focado em **Gestão Agrícola e Monitoramento**. Ele permite que produtores rurais gerenciem suas **Propriedades**, cadastrem **Talhões** de cultivo e analisem relatórios baseados em **Tipos de Plantação**. 
O aplicativo possui uma integração profunda com dados simulados de satélite para emitir alertas climáticos e biológicos de forma antecipada.

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
- **`src/types/index.ts`**: Contém todas as interfaces do domínio alinhadas ao backend Java com suporte a HATEOAS (`_links`).
- **`src/store/useAppStore.ts`**: Coração do app. Centraliza todo o estado e chamadas Axios para `Talhões`, `Propriedades`, `TiposPlantacao`, `Alertas` e autenticação do `Produtor`.

### Componentes Reutilizáveis (`src/components/`)
Componentes visuais limpos e componentizados. **Sempre prefira usá-los ao invés de recriar estilos inline nas telas:**

| Componente | Descrição |
|---|---|
| `<Header />` | Cabeçalho adaptativo com `useSafeAreaInsets()` |
| `<EmptyState />` | Placeholder para FlatLists vazias (ícone + texto) |
| `<FormInput />` | Input padronizado com suporte a ícones e feedback |
| `<PrimaryButton />` | Botão principal com loading spinner para chamadas HTTP |
| `<KpiCard />` / `<PropriedadeCard />` | Componentização específica de visualização de dados para o Dashboard |
| `<ModalPropriedade />` / `<ModalTipoPlantacao />` | Modais isolados para criação expressa de dependências |

### Navegação (`src/routes/`)
- **`MainStack.tsx`**: Stack tipada com `RootStackParamList`. Fluxo condicional Auth / App.
- **`TabRoutes.tsx`**: Bottom Tabs com Home, Talhões, Cadastro e Perfil.

---

## 4. Funcionalidades Implementadas (100% Concluídas)
1. **Autenticação de Produtor:** Login e Registro (Auth condicional no `MainStack`).
2. **Dashboard (Home):** Exibição de KPIs e botão de simulação de "Eventos Críticos" que puxa alertas de satélite simulados.
3. **Gestão de Talhões:** CRUD completo integrado à API + Filtros avançados de status e área.
4. **Monitoramento de Propriedades:** Lista de Propriedades cadastradas, com barra de capacidade e Talhões internos mapeados.
5. **Criação Expressa em Cascata:** No cadastro de Talhões, caso o produtor não tenha Propriedades ou Tipos de Plantação, ele pode criá-los na hora através de Modais sem sair da tela.

---

## 5. Integração com API Java (Pronto & Estruturado)
O aplicativo está 100% preparado e conectado à API Java Spring Boot:
* **Cliente HTTP:** Axios instalado e configurado em `src/services/api.ts` com interceptor global para tratamento de exceções (HTTP 400, 404, 500).
* **Base URL**: `http://localhost:8080/api` (Altere para o IP local ao usar dispositivo físico).
* **Arquitetura HATEOAS:** O frontend está configurado para consumir e desempacotar respostas que seguem o padrão Spring HATEOAS, extraindo a propriedade `_embedded`.
* **Fluxo Assíncrono com Zustand:** O `useAppStore` mescla o cache do `AsyncStorage` com a verdade do Backend.

---

## 6. Padrões de Código Exigidos
- **Componentização:** Se uma tela começar a inchar (mais de 150 linhas de estilos/JSX), extraia a lógica para o diretório `src/components/`.
- **Validação de Formulários:** Sempre garanta tratamento numérico forte, transformações (ex: latitude/longitude) e avise o usuário (`Alert.alert`) em caso de inputs vazios.
- **Teclado (UX):** Sempre envolva formulários com `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>` para o teclado não cobrir os inputs.
- **Domínio Agrícola:** Toda a terminologia é fixa. **NUNCA** use as palavras: Lote, Estufa, Sidonia, Espaço, Insumo, Estoque, Colheita, ou Irrigação. O domínio aceito é: **Produtor, Propriedade, Talhão, TipoPlantacao, Localizacao, AlertaAgricola**.
