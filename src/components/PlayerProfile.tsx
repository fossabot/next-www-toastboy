import { Player } from '@prisma/client';
import playerService from "services/Player";
import PlayerMugshot from 'components/PlayerMugshot';
import PlayerArse from 'components/PlayerArse';
import PlayerClubs from 'components/PlayerClubs';
import PlayerCountries from 'components/PlayerCountries';
import PlayerForm from './PlayerForm';
import PlayerLastPlayed from './PlayerLastPlayed';
import PlayerYearsActive from './PlayerYearsActive';
import PlayerResults from './PlayerResults';
import PlayerPositions from './PlayerPositions';

export default async function PlayerProfile({
    player,
}: {
    player: Player,
}) {
    const { id, login, email, born } = player;
    const born_string = born == null ? "Unknown" : born.toLocaleDateString('sv');

    return (
        <div className="w-[600px] rounded overflow-hidden shadow-lg" key={id}>
            <h1 className="text-6xl font-bold mb-4 text-center">{playerService.getName(player)}</h1>
            <PlayerMugshot idOrLogin={player.login} />
            <PlayerLastPlayed idOrLogin={player.login} />
            <PlayerClubs idOrLogin={player.login} />
            <PlayerCountries player={player} />
            <PlayerArse player={player} />
            <PlayerForm player={player} games={5} />
            <PlayerYearsActive player={player} />
            <PlayerResults player={player} year={0} />
            <PlayerPositions player={player} year={0} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{playerService.getName(player)}</div>
                <p className="text-gray-700 text-base">{email}</p>
                <p className="text-gray-900 text-xl">{login}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {born_string}
                </span>
            </div>
        </div >
    );
}
