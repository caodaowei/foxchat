import { db, teams } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { createTeamSchema, updateTeamSchema } from '../schemas.js';
// 获取团队列表
export async function getTeams(_request, reply) {
    const allTeams = await db.query.teams.findMany({
        orderBy: (teams, { desc }) => [desc(teams.createdAt)],
    });
    return reply.send({
        success: true,
        data: allTeams,
    });
}
// 创建团队
export async function createTeam(request, reply) {
    const body = createTeamSchema.parse(request.body);
    const [newTeam] = await db.insert(teams).values({
        name: body.name,
        description: body.description,
        avatar: body.avatar,
    }).returning();
    return reply.status(201).send({
        success: true,
        message: '团队创建成功',
        data: newTeam,
    });
}
// 获取单个团队
export async function getTeam(request, reply) {
    const team = await db.query.teams.findFirst({
        where: eq(teams.id, request.params.id),
        with: { users: true },
    });
    if (!team) {
        return reply.status(404).send({ success: false, message: '团队不存在' });
    }
    return reply.send({
        success: true,
        data: team,
    });
}
// 更新团队
export async function updateTeam(request, reply) {
    const body = updateTeamSchema.parse(request.body);
    const [updatedTeam] = await db.update(teams)
        .set({
        ...body,
        updatedAt: new Date(),
    })
        .where(eq(teams.id, request.params.id))
        .returning();
    if (!updatedTeam) {
        return reply.status(404).send({ success: false, message: '团队不存在' });
    }
    return reply.send({
        success: true,
        message: '团队更新成功',
        data: updatedTeam,
    });
}
// 删除团队
export async function deleteTeam(request, reply) {
    const [deletedTeam] = await db.delete(teams)
        .where(eq(teams.id, request.params.id))
        .returning();
    if (!deletedTeam) {
        return reply.status(404).send({ success: false, message: '团队不存在' });
    }
    return reply.send({
        success: true,
        message: '团队删除成功',
    });
}
//# sourceMappingURL=teams.js.map