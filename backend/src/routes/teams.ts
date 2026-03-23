import { FastifyReply, FastifyRequest } from 'fastify';
import { db, teams } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { createTeamSchema, updateTeamSchema } from '../schemas.js';

// 获取团队列表
export async function getTeams(_request: FastifyRequest, reply: FastifyReply) {
  const allTeams = await db.query.teams.findMany({
    orderBy: (teams, { desc }) => [desc(teams.createdAt)],
  });

  return reply.send({
    success: true,
    data: allTeams,
  });
}

// 创建团队
export async function createTeam(request: FastifyRequest, reply: FastifyReply) {
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
export async function getTeam(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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
export async function updateTeam(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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
export async function deleteTeam(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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
