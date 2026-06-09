// ═══════════════════════════════════════════════════════════════
// Terra Nova — Dados do FAQ (Manual de Cultivo)
// Centralização de dados estáticos para separação de conceitos (UI / Data)
// ═══════════════════════════════════════════════════════════════

export interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    pergunta: 'O que significa quando um Talhão está em status "Crítico"?',
    resposta: 'Indica que os sensores ou a análise de satélite detectaram anomalias graves, como estresse hídrico agudo, pragas ou temperatura extrema. Recomenda-se verificar o talhão imediatamente.'
  },
  {
    id: '2',
    pergunta: 'Como funciona a análise por satélite?',
    resposta: 'O sistema utiliza dados geoespaciais e análise espectral para varrer a área de cultivo buscando anomalias foliares e problemas no solo. Quando detectados, alertas vermelhos aparecerão no seu Dashboard inicial.'
  },
  {
    id: '3',
    pergunta: 'Posso criar uma Propriedade direto na tela de Talhões?',
    resposta: 'Sim! Através da criação expressa, basta tocar no ícone "+", e o formulário abrirá um modal para criação sem precisar sair da tela.'
  },
  {
    id: '4',
    pergunta: 'Como funcionam os alertas de satélite?',
    resposta: 'O sistema analisa dados do SatVeg e NasaPower para detectar anomalias climáticas ou de vegetação, disparando Alertas Agrícolas automaticamente para o seu painel.'
  },
  {
    id: '5',
    pergunta: 'Como o Terra Nova ajuda na sustentabilidade?',
    resposta: 'Ao monitorar exatamente o que a planta precisa (água, luz e nutrientes), evitamos o desperdício de recursos naturais e a aplicação excessiva de fertilizantes químicos, protegendo o solo e economizando água.'
  },
];
