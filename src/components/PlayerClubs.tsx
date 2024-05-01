'use client';

import { usePlayerClubs } from 'lib/swr';
import ClubBadge from 'components/ClubBadge';
import { Loader } from '@mantine/core';

export default function PlayerClubs({ idOrLogin }: { idOrLogin: string }) {
    const { data: clubs, error, isLoading } = usePlayerClubs(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!clubs || clubs.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {clubs.map((item: number) => (
                <ClubBadge key={item} clubId={item} />
            ))}
        </div>
    );
}
