import { player } from '@prisma/client';
import prisma from 'lib/prisma';

/**
 * Get the player login corresponding to the given string. If idOrLogin is a
 * string then we check whether a player with the given login exists. If it's a
 * number then we look up the player with that id.
 *
 * @param idOrLogin A string which may contain a player id or a login
 *
 * @returns A string containing the login of the player identified by idOrLogin
 * if such a player exists, or undefined otherwise.
 */

export async function getLogin(idOrLogin: string): Promise<string | undefined> {
    if (idOrLogin == undefined ||
        idOrLogin == "") {
        return undefined;
    }
    else if (!isNaN(Number(idOrLogin))) {
        const data = await prisma.player.findMany({
            where: {
                id: {
                    equals: Number(idOrLogin),
                },
            },
        });

        return data.length > 0 ? data[0].login : undefined;
    }
    else {
        const data = await prisma.player.findMany({
            where: {
                login: {
                    equals: idOrLogin,
                },
            },
        });

        return data.length > 0 ? data[0].login : undefined;
    }

    return undefined;
}

/**
 * Get all players matching the given criteria
 *
 * @param active Only return active players
 *
 * @returns Array of prisma.player objects
 */

export async function getAll(active = true): Promise<player[]> {
    if (active) {
        return await prisma.player.findMany({
            where: {
                finished: {
                    equals: null,
                },
            },
        });
    }
    else {
        return await prisma.player.findMany({});
    }
}

/**
 * Return a list of all player ids and logins, so that either can be used to
 * refer to a given player
 *
 * @returns A map containing all logins and ids
 */

export async function getAllIdsAndLogins() {
    const data = await prisma.player.findMany({});

    const ids = data.map((player: player) => ({
        idOrLogin: player.id.toString(),
    }));
    const logins = data.map((player: player) => ({
        idOrLogin: player.login,
    }));

    return new Map([...Array.from(ids.entries()), ...Array.from(logins.entries())]);
}

/**
 * Return a player identified by their login
 *
 * @param login The player login identifier
 *
 * @returns A player model object or null if there is no such player
 */

export async function getByLogin(login: string): Promise<player | null> {
    const data = await prisma.player.findMany({
        where: {
            login: {
                equals: login,
            },
        },
    });

    return data[0] as player;
}

/**
 * Return a player identified by their id
 *
 * @param id The player id
 *
 * @returns A player model object or null if there is no such player
 */

export async function getById(id: number): Promise<player | null> {
    if (id == null || isNaN(id)) {
        return null;
    }

    const data = await prisma.player.findMany({
        where: {
            id: {
                equals: id,
            },
        },
    });

    return data[0] as player;
}

/**
 * Player name: allows for returning "Anonymous" if desired, otherwise
 * concatenates the first name and the last name.
 *
 * @param player The player model object in question
 *
 * @returns The player name string or null if there was an error
 */

export function getName(player: player) {
    if (player == null || player == undefined) {
        return null;
    }

    if (player.anonymous) {
        return "Anonymous";
    }

    return player.first_name + " " + player.last_name;
}
