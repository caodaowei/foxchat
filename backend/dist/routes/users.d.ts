import { FastifyReply, FastifyRequest } from 'fastify';
export declare function login(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getUsers(_request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function createUser(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getUser(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function updateUser(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function deleteUser(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=users.d.ts.map