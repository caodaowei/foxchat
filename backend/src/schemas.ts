import { z } from 'zod';

// User schemas
export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
});

export const createUserSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符').max(50),
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6个字符'),
  displayName: z.string().max(100).optional(),
  role: z.enum(['admin', 'manager', 'member']).default('member'),
  teamId: z.string().uuid().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().max(100).optional(),
  role: z.enum(['admin', 'manager', 'member']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  teamId: z.string().uuid().optional(),
});

// Team schemas
export const createTeamSchema = z.object({
  name: z.string().min(1, '团队名称不能为空').max(100),
  description: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  avatar: z.string().url().optional(),
});

// Communication schemas
export const createCommunicationSchema = z.object({
  type: z.enum(['message', 'announcement', 'notification']).default('message'),
  content: z.string().min(1, '内容不能为空'),
  receiverId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
}).refine((data) => data.receiverId || data.teamId, {
  message: '必须指定接收者或团队',
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type CreateCommunicationInput = z.infer<typeof createCommunicationSchema>;
