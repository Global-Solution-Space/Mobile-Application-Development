// ═══════════════════════════════════════════════════════════════
// Terra Nova — API Service (Native Fetch)
// Comunicação com o Back-end Java Spring Boot
// ═══════════════════════════════════════════════════════════════

const BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  /**
   * Envia os dados de localização/área delimitada (talhão) para o Java
   * O Back-end processa os dados da NASA, Embrapa (SATveg) e retorna a análise da LLM
   */
  async analisarTerreno(estufaId: string, dadosLocalizacao: { latitude: number; longitude: number; areaM2?: number }) {
    const response = await fetch(`${BASE_URL}/analise/satelite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estufaId, ...dadosLocalizacao }),
    });
    
    if (!response.ok) throw new Error('Falha ao processar análise do satélite');
    return await response.json();
  },

  // Busca as estufas sincronizadas com o banco relacional
  async obterEstufas() {
    const response = await fetch(`${BASE_URL}/estufas`);
    if (!response.ok) throw new Error('Erro ao buscar estufas do servidor');
    return await response.json();
  },

  // Sincroniza um novo lote de cultivo no banco de dados do servidor
  async salvarLote(loteData: any) {
    const response = await fetch(`${BASE_URL}/lotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loteData),
    });
    if (!response.ok) throw new Error('Erro ao salvar lote no servidor');
    return await response.json();
  },

  // Registra a irrigação e atualiza o estado da estufa no banco
  async registrarIrrigacao(loteId: string, quantidadeMl: number, tipo: string) {
    const response = await fetch(`${BASE_URL}/irrigacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loteId, quantidadeMl, tipo }),
    });
    if (!response.ok) throw new Error('Erro ao registrar irrigação no servidor');
    return await response.json();
  }
};