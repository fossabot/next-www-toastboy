import { GameDay } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class GameDayService {
    /**
     * Validate a GameDay
     * @param gameDay The GameDay to validate
     * @returns the validated GameDay
     * @throws An error if the GameDay is invalid.
     */
    validate(gameDay: GameDay): GameDay {
        if (!gameDay.id || !Number.isInteger(gameDay.id) || gameDay.id < 0) {
            throw new Error(`Invalid id value: ${gameDay.id}`);
        }
        if (gameDay.game_date !== null && !(gameDay.game_date instanceof Date)) {
            throw new Error(`Invalid game_date value: ${gameDay.game_date}`);
        }
        if (gameDay.game !== null && typeof gameDay.game !== 'boolean') {
            throw new Error(`Invalid game value: ${gameDay.game}`);
        }
        if (gameDay.mail_sent !== null && !(gameDay.mail_sent instanceof Date)) {
            throw new Error(`Invalid mail_sent value: ${gameDay.mail_sent}`);
        }
        if (gameDay.comment !== null && typeof gameDay.comment !== 'string') {
            throw new Error(`Invalid comment value: ${gameDay.comment}`);
        }
        if (gameDay.bibs !== null && typeof gameDay.bibs !== 'string') {
            throw new Error(`Invalid bibs value: ${gameDay.bibs}`);
        }
        if (gameDay.picker_games_history !== null && !Number.isInteger(gameDay.picker_games_history) ||
            !(gameDay.picker_games_history == 5 || gameDay.picker_games_history == 10)) {
            throw new Error(`Invalid picker_games_history value: ${gameDay.picker_games_history}`);
        }

        return gameDay;
    }

    /**
     * Retrieves a GameDay by its ID.
     * @param id - The ID of the GameDay to retrieve.
     * @returns A Promise that resolves to the GameDay object if found, or null if not found.
     * @throws If there is an error while fetching the GameDay.
     */
    async get(id: number): Promise<GameDay | null> {
        try {
            return prisma.gameDay.findUnique({
                where: {
                    id: id
                },
            });
        } catch (error) {
            log(`Error fetching GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all GameDay.
     * @returns A promise that resolves to an array of GameDays or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<GameDay[] | null> {
        try {
            return prisma.gameDay.findMany({});
        } catch (error) {
            log(`Error fetching GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new gameDay.
     * @param data The data for the new gameDay.
     * @returns A promise that resolves to the created gameDay, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: GameDay): Promise<GameDay | null> {
        try {
            return await prisma.gameDay.create({
                data: this.validate(data)
            });
        } catch (error) {
            log(`Error creating GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a gameDay.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted gameDay, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: GameDay): Promise<GameDay | null> {
        try {
            return await prisma.gameDay.upsert({
                where: {
                    id: data.id
                },
                update: data,
                create: data,
            });
        } catch (error) {
            log(`Error upserting GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a gameDay by its ID.
     * @param id - The ID of the gameDay to delete.
     * @throws If there is an error deleting the gameDay.
     */
    async delete(id: number): Promise<void> {
        try {
            await prisma.gameDay.delete({
                where: {
                    id: id
                },
            });
        } catch (error) {
            log(`Error deleting GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all gameDays.
     * @returns A promise that resolves when all gameDays are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.gameDay.deleteMany();
        } catch (error) {
            log(`Error deleting GameDays: ${error}`);
            throw error;
        }
    }
}

const gameDayService = new GameDayService();
export default gameDayService;