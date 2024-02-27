import Image from 'next/image';

import { club } from '@prisma/client';

export default function ClubBadge({
    club,
}: {
    club: club,
}) {
    const url = `/api/footy/club/badge/${club.id}`;

    return (
        <Image
            className="w-full"
            width={150}
            height={150}
            src={url}
            priority={true}
            alt={club.club_name}
        />
    );
}
