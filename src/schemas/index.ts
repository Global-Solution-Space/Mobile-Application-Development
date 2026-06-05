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

// ── Schemas de Domínio Agrícola ──
export const PropriedadeSchema = z.object({
  nome: z.string().trim().min(1, { error: 'O nome da propriedade é obrigatório' }).max(30, { error: 'O nome da propriedade deve ter no máximo 30 caracteres' }),
  tamanhoTotal: z.coerce.number({ error: 'O tamanho deve ser um número válido' }).positive({ error: 'O tamanho da propriedade deve ser maior que zero' }).max(10000, { error: 'O tamanho total da propriedade não pode exceder 10000.00 hectares.' }),
  locLatitude: z.coerce.number({ error: 'A latitude deve ser numérica' }).min(-33.75, { message: 'A latitude deve ser no mínimo -33.75 (território brasileiro)' }).max(5.27, { message: 'A latitude deve ser no máximo 5.27 (território brasileiro)' }),
  locLongitude: z.coerce.number({ error: 'A longitude deve ser numérica' }).min(-73.98, { message: 'A longitude deve ser no mínimo -73.98 (território brasileiro)' }).max(-34.79, { message: 'A longitude deve ser no máximo -34.79 (território brasileiro)' }),
});

export const TalhaoSchema = z.object({
  nomeTalhao: z.string().trim().min(1, { error: 'O nome do talhão é obrigatório' }).max(30, { error: 'O nome do talhão deve ter no máximo 30 caracteres' }),
  volumArea: z.coerce.number({ error: 'A área deve ser numérica' }).positive({ error: 'A área do Talhão deve ser maior que zero' }).max(1000, { error: 'A área do talhão não pode exceder 1000.00 hectares.' }),
  locLatitude: z.coerce.number({ error: 'A latitude deve ser numérica' }).min(-33.75, { message: 'A latitude deve ser no mínimo -33.75 (território brasileiro)' }).max(5.27, { message: 'A latitude deve ser no máximo 5.27 (território brasileiro)' }),
  locLongitude: z.coerce.number({ error: 'A longitude deve ser numérica' }).min(-73.98, { message: 'A longitude deve ser no mínimo -73.98 (território brasileiro)' }).max(-34.79, { message: 'A longitude deve ser no máximo -34.79 (território brasileiro)' }),
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
  nivelAlerta: z.string(),
  resolvido: z.enum(['S', 'N']),
  idTalhao: z.number()
});

export const DadoTemporalResponseSchema = z.object({
  idDado: z.number(),
  dataLeitura: z.string(),
  valor: z.number(),
  idTalhao: z.number(),
  idReqApi: z.number(),
  tipoApiNome: z.string(),
  tipoParam: z.string()
});
