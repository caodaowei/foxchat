import { FastifyReply, FastifyRequest } from 'fastify';
export declare function getCommunications(_request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getMyCommunications(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function createCommunication(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function markAsRead(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function deleteCommunication(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=communications.d.ts.map