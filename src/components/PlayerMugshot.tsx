import Image from 'next/image'
import { player } from '@prisma/client'
import { getName } from 'lib/players'

export default function PlayerMugshot({
    player,
}: {
    player: player,
}) {
    const url = player.mugshot ?
        "http://localhost:3880/footy/images/mugshots/" + player.mugshot :
        "http://localhost:3880/footy/images/mugshots/manofmystery.jpg"

    return (
        <Image
            className="w-full"
            width={250}
            height={250}
            src={url}
            alt={getName(player) || "Player"}
        />
    )
}