import { Colors } from '../theme/colors';

export interface TelemetryConfig {
  // Configurações da API
  tipoApiNome: string;
  tipoParam: string;
  nomeExibicao: string;
  
  // Painel de Análise
  title: string;
  description: string;
  buttonIcon: any;
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  sectionHeading: string;
  emptyMessage: string;
  subtitleGrafico: string;

  // Cartão de Histórico
  previewHeading: string;
  valColor: string;
  valFontWeight: 'bold' | 'normal';
  
  // Tabela e Gráfico de Detalhes
  badgeIcon: any;
  badgeColor: string;
  thValueText: string;
  isDynamicScale: boolean; // Define se a escala Y do gráfico foca dinamicamente nos dados ou crava limites.

  // Funções de formatação e visualização
  formatValue: (val: number) => string;
  formatTableValue: (val: number) => string;
}

export const TELEMETRY_CONFIGS: Record<'satveg' | 'nasa', TelemetryConfig> = {
  satveg: {
    tipoApiNome: "SATVEG",
    tipoParam: "NDVI",
    nomeExibicao: "SATveg",
    
    title: "🛰️ Monitoramento de Índice de Vegetação (NDVI)",
    description: "Conecta com a série histórica de satélite da Embrapa SATveg usando a latitude e longitude do talhão para monitorar a saúde biológica da plantação.",
    buttonIcon: "sync-alt",
    buttonText: "Solicitar Telemetria SATveg",
    buttonColor: Colors.accent,
    buttonTextColor: Colors.bgPrimary,
    sectionHeading: "Dados de Vegetação Atuais",
    emptyMessage: "Nenhum dado temporal encontrado para este talhão.",
    subtitleGrafico: "Gráfico de NDVI",
    
    previewHeading: "Índice de Vegetação NDVI (preview):",
    valColor: Colors.textPrimary,
    valFontWeight: 'normal',
    
    badgeIcon: 'satellite',
    badgeColor: Colors.accent,
    thValueText: 'NDVI (Média)',
    isDynamicScale: false,
    
    formatValue: (val: number) => (val || 0).toFixed(3),
    formatTableValue: (val: number) => (val || 0).toFixed(4),
  },
  nasa: {
    tipoApiNome: "NASAPOWER",
    tipoParam: "PRECTOTCORR",
    nomeExibicao: "NASA Power",
    
    title: "☀️ Análise de Precipitação (NASA Power)",
    description: "Obtém dados climatológicos diários de precipitação (chuva em mm) diretamente dos satélites meteorológicos da NASA automaticamente (de 2020 até hoje).",
    buttonIcon: "cloud-download-alt",
    buttonText: "Solicitar Clima NASA",
    buttonColor: Colors.info,
    buttonTextColor: Colors.textPrimary,
    sectionHeading: "Dados Climáticos Atuais",
    emptyMessage: "Nenhum dado climático encontrado para este talhão.",
    subtitleGrafico: "Gráfico de Precipitação",

    previewHeading: "Dados de Precipitação (preview):",
    valColor: Colors.info,
    valFontWeight: 'bold',

    badgeIcon: 'cloud-sun-rain',
    badgeColor: Colors.info,
    thValueText: 'Chuva (mm)',
    isDynamicScale: true,

    formatValue: (val: number) => `${(val || 0).toFixed(1)} mm`,
    formatTableValue: (val: number) => `${(val || 0).toFixed(2)} mm`,
  }
};
