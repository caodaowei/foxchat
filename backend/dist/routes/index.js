import * as userHandlers from './users.js';
import * as teamHandlers from './teams.js';
import * as communicationHandlers from './communications.js';
// JWT 验证装饰器
async function authenticate(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        reply.status(401).send({ success: false, message: '未授权' });
    }
}
export default async function routes(fastify) {
    // Health check
    fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));
    // Auth routes
    fastify.post('/users/login', userHandlers.login);
    // Protected routes
    fastify.register(async function (fastify) {
        fastify.addHook('preHandler', authenticate);
        // Users
        fastify.get('/users', userHandlers.getUsers);
        fastify.post('/users', userHandlers.createUser);
        fastify.get('/users/:id', userHandlers.getUser);
        fastify.put('/users/:id', userHandlers.updateUser);
        fastify.delete('/users/:id', userHandlers.deleteUser);
        // Teams
        fastify.get('/teams', teamHandlers.getTeams);
        fastify.post('/teams', teamHandlers.createTeam);
        fastify.get('/teams/:id', teamHandlers.getTeam);
        fastify.put('/teams/:id', teamHandlers.updateTeam);
        fastify.delete('/teams/:id', teamHandlers.deleteTeam);
        // Communications
        fastify.get('/communications', communicationHandlers.getCommunications);
        fastify.get('/communications/my', communicationHandlers.getMyCommunications);
        fastify.post('/communications', communicationHandlers.createCommunication);
        fastify.patch('/communications/:id/read', communicationHandlers.markAsRead);
        fastify.delete('/communications/:id', communicationHandlers.deleteCommunication);
    }, { prefix: '/api' });
}
//# sourceMappingURL=index.js.map