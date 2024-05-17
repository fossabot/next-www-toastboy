import playerService from 'services/Player';
import { handleGET } from 'app/api/footy/common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(async () => {
        const player = await playerService.getByIdOrLogin(params.idOrLogin);
        if (!player) { return null; }
        return playerService.getForm(player.id, 0, parseInt(params.games));
    }, { params });
