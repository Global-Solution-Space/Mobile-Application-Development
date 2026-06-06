import { z } from 'zod';

// ── Schemas de Autenticação ──
export const LoginSchema = z.object({
  email: z.string().trim().min(1, { error: 'O e-mail é obrigatório' }).pipe(z.email({ error: 'Formato de e-mail inválido' })),
  senha: z.string().min(1, { error: 'A senha é obrigatória' }),
});

export const RegisterSchema = z.object({
  nome: z.string().trim().min(3, { error: 'O nome deve ter no mínimo 3 caracteres' }).max(30, { error: 'O nome deve ter no máximo 30 caracteres' }),
  email: z.string().trim().min(1, { error: 'O e-mail é obrigatório' }).max(30, { error: 'O e-mail deve ter no máximo 30 caracteres' }).pipe(z.email({ error: 'Formato de e-mail inválido' })),
  senha: z.string().min(6, { error: 'A senha deve ter pelo menos 6 caracteres' }).max(30, { error: 'A senha deve ter no máximo 30 caracteres' }),
  confirmarSenha: z.string().min(6, { error: 'A confirmação de senha é obrigatória' }),
  ddd: z.string().max(2, { error: 'DDD inválido' }).optional().or(z.literal('')),
  telefone: z.string().max(9, { error: 'O telefone deve ter no máximo 9 dígitos' }).optional().or(z.literal('')),
}).refine((data) => data.senha === data.confirmarSenha, {
  error: 'As senhas não coincidem. Verifique e tente novamente.',
  path: ['confirmarSenha'],
});

export const EditarPerfilSchema = z.object({
  nome: z.string().trim().min(3, { error: 'O nome deve ter no mínimo 3 caracteres' }).max(30, { error: 'O nome deve ter no máximo 30 caracteres' }),
  ddd: z.string().trim().refine((value) => value.length === 0 || /^\d{2}$/.test(value), { error: 'Informe um DDD com 2 dígitos', }),
  telefone: z.string().trim().refine((value) => value.length === 0 || /^\d{8,9}$/.test(value), { error: 'O telefone deve ter 8 ou 9 dígitos', }),
  novoEmail: z.string().trim().max(30, { error: 'O e-mail deve ter no máximo 30 caracteres' }).refine(
    (value) => value.length === 0 || z.email().safeParse(value).success,
    { error: 'Formato de e-mail inválido' }
  ),
  novaSenha: z.string().max(30, { error: 'A senha deve ter no máximo 30 caracteres' }).refine(
    (value) => value.length === 0 || value.length >= 6,
    { error: 'A nova senha deve ter pelo menos 6 caracteres' }
  ),
  confirmarSenha: z.string(),
}).refine((data) => (!data.ddd && !data.telefone) || (data.ddd && data.telefone), {
  error: 'Preencha DDD e telefone juntos',
  path: ['telefone'],
}).refine((data) => data.novaSenha.length === 0 || data.confirmarSenha.length > 0, {
  error: 'Confirme a nova senha',
  path: ['confirmarSenha'],
}).refine((data) => data.novaSenha.length === 0 || data.novaSenha === data.confirmarSenha, {
  error: 'As senhas não coincidem. Verifique e tente novamente.',
  path: ['confirmarSenha'],
});

// ── Schemas de Domínio Agrícola ──
export const PropriedadeSchema = z.object({
  nome: z.string().trim().min(1, { error: 'O nome da propriedade é obrigatório' }).max(30, { error: 'O nome da propriedade deve ter no máximo 30 caracteres' }),
  tamanhoTotal: z.coerce.number({ error: 'O tamanho deve ser um número válido' }).positive({ error: 'O tamanho da propriedade deve ser maior que zero' }).max(10000, { error: 'O tamanho total da propriedade não pode exceder 10000.00 hectares.' }),
  locLatitude: z.coerce.number({ error: 'A latitude deve ser numérica' }).min(-34.00, { message: 'A latitude deve ser no mínimo -34.00' }).max(6.00, { message: 'A latitude deve ser no máximo 6.00' }),
  locLongitude: z.coerce.number({ error: 'A longitude deve ser numérica' }).min(-74.00, { message: 'A longitude deve ser no mínimo -74.00' }).max(-28.00, { message: 'A longitude deve ser no máximo -28.00' }),
});

export const TalhaoSchema = z.object({
  nomeTalhao: z.string().trim().min(1, { error: 'O nome do talhão é obrigatório' }).max(30, { error: 'O nome do talhão deve ter no máximo 30 caracteres' }),
  volumArea: z.coerce.number({ error: 'A área deve ser numérica' }).positive({ error: 'A área do Talhão deve ser maior que zero' }).max(1000, { error: 'A área do talhão não pode exceder 1000.00 hectares.' }),
  locLatitude: z.coerce.number({ error: 'A latitude deve ser numérica' }).min(-34.00, { message: 'A latitude deve ser no mínimo -34.00' }).max(6.00, { message: 'A latitude deve ser no máximo 6.00' }),
  locLongitude: z.coerce.number({ error: 'A longitude deve ser numérica' }).min(-74.00, { message: 'A longitude deve ser no mínimo -74.00' }).max(-28.00, { message: 'A longitude deve ser no máximo -28.00' }),
  idTipoPlantacao: z.number({ error: 'Tipo de plantação inválido' }).positive({ error: 'Selecione um tipo de plantação válido' }),
  idPropriedade: z.number({ error: 'Propriedade inválida' }).positive({ error: 'Selecione uma propriedade válida' }),
});

export const TipoPlantacaoSchema = z.object({
  tipoPlant: z.string().trim().min(1, { error: 'O nome do tipo de plantação é obrigatório' }).max(30, { error: 'O nome do tipo de plantação deve ter no máximo 30 caracteres' }),
});

// ── Schemas de Resposta da API (Camada Anti-Corrupção) ──
export const ProdutorResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  senha: z.string().optional()
});

export const TelefoneResponseSchema = z.object({
  id: z.number(),
  ddd: z.string(),
  numero: z.string(),
  idProdutor: z.number()
});

export const LocalizacaoResponseSchema = z.object({
  id: z.number(),
  locLatitude: z.number(),
  locLongitude: z.number()
});

export const TipoPlantacaoResponseSchema = z.object({
  id: z.number(),
  tipoPlant: z.string()
});

export const PropriedadeResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  tamanhoTotal: z.number(),
  idProdutor: z.number(),
  idLocalizacao: z.number()
});

export const TalhaoResponseSchema = z.object({
  id: z.number(),
  nomeTalhao: z.string(),
  volumArea: z.number(),
  idTipoPlantacao: z.number(),
  idPropriedade: z.number(),
  idLocalizacao: z.number()
});

export const AlertaAgricolaResponseSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  descricao: z.string(),
  nivelAlerta: z.enum(['ALTO', 'MEDIO', 'BAIXO', 'CRITICO']),
  resolvido: z.enum(['S', 'N']),
  idTalhao: z.number()
});

export const ReqApiResponseSchema = z.object({
  id: z.number(),
  tipoParam: z.string(),
  dataAnalise: z.union([z.string(), z.array(z.number())]).transform(val => {
    if (Array.isArray(val) && val.length >= 3) return `${val[0]}-${String(val[1]).padStart(2, '0')}-${String(val[2]).padStart(2, '0')}`;
    if (Array.isArray(val)) return "";
    return val;
  }),
  tipoApiNome: z.string(),
  idTipoApi: z.number()
});

export const DadoTemporalResponseSchema = z.object({
  idDado: z.number(),
  dataLeitura: z.union([z.string(), z.array(z.number())]).transform(val => {
    if (Array.isArray(val) && val.length >= 3) return `${val[0]}-${String(val[1]).padStart(2, '0')}-${String(val[2]).padStart(2, '0')}`;
    if (Array.isArray(val)) return "";
    return val;
  }),
  valor: z.number(),
  idTalhao: z.number(),
  idReqApi: z.number(),
  tipoApiNome: z.string(),
  tipoParam: z.string()
});
