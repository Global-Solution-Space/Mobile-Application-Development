import { z } from 'zod';

// ── Schemas de Autenticação ──
export const LoginSchema = z.object({
  email: z.string().trim().min(1, { error: 'O e-mail é obrigatório' }).pipe(z.email({ error: 'Formato de e-mail inválido' })),
  senha: z.string().min(1, { error: 'A senha é obrigatória' }),
});

export const RegisterSchema = z.object({
  nome: z.string().trim().min(3, { error: 'O nome deve ter no mínimo 3 caracteres' }),
  email: z.string().trim().min(1, { error: 'O e-mail é obrigatório' }).pipe(z.email({ error: 'Formato de e-mail inválido' })),
  senha: z.string().min(6, { error: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmarSenha: z.string().min(6, { error: 'A confirmação de senha é obrigatória' }),
  ddd: z.string().max(2, { error: 'DDD inválido' }).optional().or(z.literal('')),
  telefone: z.string().max(10, { error: 'Telefone inválido' }).optional().or(z.literal('')),
}).refine((data) => data.senha === data.confirmarSenha, {
  error: 'As senhas não coincidem. Verifique e tente novamente.',
  path: ['confirmarSenha'],
});

// ── Schemas de Domínio Agrícola ──
export const PropriedadeSchema = z.object({
  nome: z.string().trim().min(1, { error: 'O nome da propriedade é obrigatório' }),
  tamanhoTotal: z.coerce.number({ error: 'O tamanho deve ser um número válido' }).positive({ error: 'O tamanho da propriedade deve ser maior que zero' }),
  locLatitude: z.coerce.number({ error: 'A latitude deve ser numérica' }),
  locLongitude: z.coerce.number({ error: 'A longitude deve ser numérica' }),
});

export const TalhaoSchema = z.object({
  nomeTalhao: z.string().trim().min(1, { error: 'O nome do talhão é obrigatório' }),
  volumArea: z.coerce.number({ error: 'A área deve ser numérica' }).positive({ error: 'A área do Talhão deve ser maior que zero' }),
  locLatitude: z.coerce.number({ error: 'A latitude deve ser numérica' }),
  locLongitude: z.coerce.number({ error: 'A longitude deve ser numérica' }),
  idTipoPlantacao: z.number({ error: 'Tipo de plantação inválido' }).positive({ error: 'Selecione um tipo de plantação válido' }),
  idPropriedade: z.number({ error: 'Propriedade inválida' }).positive({ error: 'Selecione uma propriedade válida' }),
});

export const TipoPlantacaoSchema = z.object({
  tipoPlant: z.string().trim().min(1, { error: 'O nome do tipo de plantação é obrigatório' }),
});

// ── Schemas de Resposta da API (Camada Anti-Corrupção) ──
export const ProdutorResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string()
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
