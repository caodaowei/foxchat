import { db, communications } from '../db/index.js';
import { eq, desc, or, and } from 'drizzle-orm';
import { createCommunicationSchema } from '../schemas.js';
// 获取沟通记录列表
export async function getCommunications(_request, reply) {
    const allCommunications = await db.query.communications.findMany({
        with: {
            sender: true,
            receiver: true,
            team: true,
        },
        orderBy: [desc(communications.createdAt)],
    });
    return reply.send({
        success: true,
        data: allCommunications.map(c => ({
            id: c.id,
            senderId: c.senderId,
            receiverId: c.receiverId,
            teamId: c.teamId,
            type: c.type,
            content: c.content,
            isRead: c.isRead,
            createdAt: c.createdAt,
            senderName: c.sender?.displayName || c.sender?.username,
            receiverName: c.receiver?.displayName || c.receiver?.username,
            teamName: c.team?.name,
        })),
    });
}
// 获取我的消息
export async function getMyCommunications(request, reply) {
    const user = request.user;
    const myCommunications = await db.query.communications.findMany({
        where: or(eq(communications.receiverId, user.id), eq(communications.senderId, user.id)),
        with: {
            sender: true,
            receiver: true,
            team: true,
        },
        orderBy: [desc(communications.createdAt)],
    });
    return reply.send({
        success: true,
        data: myCommunications,
    });
}
// 创建沟通记录
export async function createCommunication(request, reply) {
    const body = createCommunicationSchema.parse(request.body);
    const user = request.user;
    const [newCommunication] = await db.insert(communications).values({
        senderId: user.id,
        receiverId: body.receiverId,
        teamId: body.teamId,
        type: body.type,
        content: body.content,
    }).returning();
    return reply.status(201).send({
        success: true,
        message: '消息发送成功',
        data: newCommunication,
    });
}
// 标记已读
export async function markAsRead(request, reply) {
    const user = request.user;
    const [updated] = await db.update(communications)
        .set({ isRead: true })
        .where(and(eq(communications.id, request.params.id), eq(communications.receiverId, user.id)))
        .returning();
    if (!updated) {
        return reply.status(404).send({ success: false, message: '消息不存在或无权限' });
    }
    return reply.send({
        success: true,
        message: '已标记为已读',
    });
}
// 删除沟通记录
export async function deleteCommunication(request, reply) {
    const user = request.user;
    const [deleted] = await db.delete(communications)
        .where(and(eq(communications.id, request.params.id), eq(communications.senderId, user.id)))
        .returning();
    if (!deleted) {
        return reply.status(404).send({ success: false, message: '消息不存在或无权限' });
    }
    return reply.send({
        success: true,
        message: '消息删除成功',
    });
}
//# sourceMappingURL=communications.js.map