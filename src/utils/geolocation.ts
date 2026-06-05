export const validarCoordenadasNoBrasil = async (
  latitude: number,
  longitude: number
): Promise<{ isValid: boolean; message?: string }> => {
  try {
    const geoRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
    );
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.countryCode !== 'BR') {
        return {
          isValid: false,
          message: `As coordenadas não pertencem ao Brasil (País: ${geoData.countryName || 'Oceano/Desconhecido'}).`,
        };
      }
    }
    return { isValid: true };
  } catch (e) {
    console.warn('Erro ao validar país via geocoding', e);
    // Em caso de erro na API externa, optamos por não bloquear o usuário
    return { isValid: true };
  }
};
