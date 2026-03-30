import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const createUserSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<["admin", "manager", "member"]>>;
    teamId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    email: string;
    role: "admin" | "manager" | "member";
    password: string;
    teamId?: string | undefined;
    displayName?: string | undefined;
}, {
    username: string;
    email: string;
    password: string;
    teamId?: string | undefined;
    displayName?: string | undefined;
    role?: "admin" | "manager" | "member" | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    displayName: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["admin", "manager", "member"]>>;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "suspended"]>>;
    teamId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "active" | "inactive" | "suspended" | undefined;
    teamId?: string | undefined;
    email?: string | undefined;
    displayName?: string | undefined;
    role?: "admin" | "manager" | "member" | undefined;
}, {
    status?: "active" | "inactive" | "suspended" | undefined;
    teamId?: string | undefined;
    email?: string | undefined;
    displayName?: string | undefined;
    role?: "admin" | "manager" | "member" | undefined;
}>;
export declare const createTeamSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    avatar?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    avatar?: string | undefined;
}>;
export declare const updateTeamSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    avatar?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    avatar?: string | undefined;
}>;
export declare const createCommunicationSchema: z.ZodEffects<z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<["message", "announcement", "notification"]>>;
    content: z.ZodString;
    receiverId: z.ZodOptional<z.ZodString>;
    teamId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "message" | "announcement" | "notification";
    content: string;
    teamId?: string | undefined;
    receiverId?: string | undefined;
}, {
    content: string;
    type?: "message" | "announcement" | "notification" | undefined;
    teamId?: string | undefined;
    receiverId?: string | undefined;
}>, {
    type: "message" | "announcement" | "notification";
    content: string;
    teamId?: string | undefined;
    receiverId?: string | undefined;
}, {
    content: string;
    type?: "message" | "announcement" | "notification" | undefined;
    teamId?: string | undefined;
    receiverId?: string | undefined;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type CreateCommunicationInput = z.infer<typeof createCommunicationSchema>;
//# sourceMappingURL=schemas.d.ts.map