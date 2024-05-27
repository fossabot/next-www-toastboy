'use client';

import { Loader } from '@mantine/core';
import { Key } from 'react';
import { usePlayerForm } from 'lib/swr';
import GameDayLink from 'components/GameDayLink';

interface PlayerFormProps {
    idOrLogin: string;
    games: number;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ idOrLogin, games }) => {
    const { data: outcomes, error, isLoading } = usePlayerForm(idOrLogin, games);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!outcomes || outcomes.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {outcomes.map((outcome: { gameDayId: number; points: number; }, index: Key) => (
                <p key={index}>Game <GameDayLink id={outcome.gameDayId} />: {outcome.points}</p>
            ))}
        </div>
    );
};

export default PlayerForm;
