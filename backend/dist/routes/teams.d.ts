import { FastifyReply, FastifyRequest } from 'fastify';
export declare function getTeams(_request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function createTeam(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function getTeam(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function updateTeam(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
export declare function deleteTeam(request: FastifyRequest<{
    Params: {
        id: string;
    };
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=teams.d.ts.map