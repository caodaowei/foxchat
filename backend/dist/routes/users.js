import bcrypt from 'bcryptjs';
import { db, users } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { loginSchema, createUserSchema, updateUserSchema } from '../schemas.js';
// 登录
export async function login(request, reply) {
    const body = loginSchema.parse(request.body);
    const user = await db.query.users.findFirst({
        where: eq(users.username, body.username),
    });
    if (!user) {
        return reply.status(401).send({ success: false, message: '用户名或密码错误' });
    }
    const validPassword = await bcrypt.compare(body.password, user.passwordHash);
    if (!validPassword) {
        return reply.status(401).send({ success: false, message: '用户名或密码错误' });
    }
    // Update last login
    await db.update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));
    // Generate JWT token
    const token = await request.server.jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    });
    return reply.send({
        success: true,
        message: '登录成功',
        data: {
            user: {
                id: user.id,
                teamId: user.teamId,
                username: user.username,
                email: user.email,
                displayName: user.displayName,
                avatar: user.avatar,
                role: user.role,
                status: user.status,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
            },
            token,
        },
    });
}
// 获取用户列表
export async function getUsers(_request, reply) {
    const allUsers = await db.query.users.findMany({
        with: { team: true },
        orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
    return reply.send({
        success: true,
        data: allUsers.map(u => ({
            id: u.id,
            teamId: u.teamId,
            username: u.username,
            email: u.email,
            displayName: u.displayName,
            avatar: u.avatar,
            role: u.role,
            status: u.status,
            lastLoginAt: u.lastLoginAt,
            createdAt: u.createdAt,
        })),
    });
}
// 创建用户
export async function createUser(request, reply) {
    const body = createUserSchema.parse(request.body);
    // Check if username exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.username, body.username),
    });
    if (existingUser) {
        return reply.status(409).send({ success: false, message: '用户名已存在' });
    }
    // Check if email exists
    const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, body.email),
    });
    if (existingEmail) {
        return reply.status(409).send({ success: false, message: '邮箱已被使用' });
    }
    const passwordHash = await bcrypt.hash(body.password, 10);
    const [newUser] = await db.insert(users).values({
        username: body.username,
        email: body.email,
        passwordHash,
        displayName: body.displayName,
        role: body.role,
        teamId: body.teamId,
    }).returning();
    return reply.status(201).send({
        success: true,
        message: '用户创建成功',
        data: newUser,
    });
}
// 获取单个用户
export async function getUser(request, reply) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, request.params.id),
        with: { team: true },
    });
    if (!user) {
        return reply.status(404).send({ success: false, message: '用户不存在' });
    }
    return reply.send({
        success: true,
        data: user,
    });
}
// 更新用户
export async function updateUser(request, reply) {
    const body = updateUserSchema.parse(request.body);
    const [updatedUser] = await db.update(users)
        .set({
        ...body,
        updatedAt: new Date(),
    })
        .where(eq(users.id, request.params.id))
        .returning();
    if (!updatedUser) {
        return reply.status(404).send({ success: false, message: '用户不存在' });
    }
    return reply.send({
        success: true,
        message: '用户更新成功',
        data: updatedUser,
    });
}
// 删除用户
export async function deleteUser(request, reply) {
    const [deletedUser] = await db.delete(users)
        .where(eq(users.id, request.params.id))
        .returning();
    if (!deletedUser) {
        return reply.status(404).send({ success: false, message: '用户不存在' });
    }
    return reply.send({
        success: true,
        message: '用户删除成功',
    });
}
//# sourceMappingURL=users.js.map