import { Outcome, PlayerResponse, Team } from '@prisma/client';
import outcomeService from 'services/Outcome';
import prisma from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    outcome: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultOutcome: Outcome = {
    gameDayId: 1,
    playerId: 12,
    response: 'Yes',
    responseTime: new Date(),
    points: 3,
    team: 'A',
    comment: 'Test comment',
    pub: true,
    paid: false,
    goalie: false,
};

const invalidOutcome: Outcome = {
    ...defaultOutcome,
    response: 'No',
    team: 'X' as Team,
};

const outcomeList: Outcome[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultOutcome,
    playerId: index % 10 + 1,
    gameDayId: index / 10 + 1,
}));

describe('OutcomeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.outcome.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            }
        }) => {
            const outcome = outcomeList.find((outcome) => outcome.gameDayId === args.where.gameDayId_playerId.gameDayId && outcome.playerId === args.where.gameDayId_playerId.playerId);
            return Promise.resolve(outcome ? outcome : null);
        });

        (prisma.outcome.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number, gameDayId: number }, take: number, orderBy: { responseTime: 'desc' } }) => {
            return Promise.resolve(outcomeList.filter((outcome) => outcome.playerId === args.where.playerId && outcome.gameDayId < args.where.gameDayId).slice(0, args.take));
        });

        (prisma.outcome.create as jest.Mock).mockImplementation((args: { data: Outcome }) => {
            const outcome = outcomeList.find((outcome) => outcome.gameDayId === args.data.gameDayId && outcome.playerId === args.data.playerId);

            if (outcome) {
                return Promise.reject(new Error('Outcome already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.outcome.upsert as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            },
            update: Outcome,
            create: Outcome,
        }) => {
            const outcome = outcomeList.find((outcome) => outcome.gameDayId === args.where.gameDayId_playerId.gameDayId && outcome.playerId === args.where.gameDayId_playerId.playerId);

            if (outcome) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.outcome.delete as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            }
        }) => {
            const outcome = outcomeList.find((outcome) => outcome.gameDayId === args.where.gameDayId_playerId.gameDayId && outcome.playerId === args.where.gameDayId_playerId.playerId);
            return Promise.resolve(outcome ? outcome : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct Outcome for GameDay 1, Player 1', async () => {
            const result = await outcomeService.get(1, 1);
            expect(result).toEqual({
                ...defaultOutcome,
                gameDayId: 1,
                playerId: 1,
            } as Outcome);
        });

        it('should return null for GameDay 7, Player 16', async () => {
            const result = await outcomeService.get(7, 16);
            expect(result).toBeNull();
        });
    });

    describe('getByGameDay', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockImplementation((args: { where: { gameDayId: number } }) => {
                return Promise.resolve(outcomeList.filter((outcome) => outcome.gameDayId === args.where.gameDayId));
            });
        });

        it('should retrieve the correct Outcomes for GameDay id 1', async () => {
            const result = await outcomeService.getByGameDay(1);
            expect(result.length).toEqual(1);
            for (const outcomeResult of result) {
                expect(outcomeResult).toEqual({
                    ...defaultOutcome,
                    playerId: expect.any(Number),
                    gameDayId: 1,
                } as Outcome);
            }
        });

        it('should return an empty list when retrieving outcomes for GameDay id 101', async () => {
            const result = await outcomeService.getByGameDay(101);
            expect(result).toEqual([]);
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(outcomeList.filter((outcome) => outcome.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct Outcomes for Player ID 1', async () => {
            const result = await outcomeService.getByPlayer(1);
            expect(result.length).toEqual(10);
            for (const outcomeResult of result) {
                expect(outcomeResult).toEqual({
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: expect.any(Number),
                } as Outcome);
            }
        });

        it('should return an empty list when retrieving Outcomes for Player id 11', async () => {
            const result = await outcomeService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getPlayerForm', () => {
        it('should retrieve the correct player form for Player ID 1 and GameDay ID 5 with history of 3', async () => {
            // Mock the outcomeList data
            const outcomeListMock: Outcome[] = [
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 4,
                },
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 3,
                },
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 2,
                },
            ];

            // Mock the prisma.outcome.findMany function
            (prisma.outcome.findMany as jest.Mock).mockResolvedValueOnce(outcomeListMock);

            const result = await outcomeService.getPlayerForm(1, 5, 3);
            expect(result).toEqual(outcomeListMock);
        });

        it('should return an empty list when retrieving player form for Player ID 2 and GameDay ID 1 with history of 5', async () => {
            // Mock the prisma.outcome.findMany function
            (prisma.outcome.findMany as jest.Mock).mockResolvedValueOnce([]);

            const result = await outcomeService.getPlayerForm(2, 1, 5);
            expect(result).toEqual([]);
        });

        it('should handle errors and throw an error', async () => {
            // Mock the prisma.outcome.findMany function to throw an error
            (prisma.outcome.findMany as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

            await expect(outcomeService.getPlayerForm(1, 5, 3)).rejects.toThrow('Test error');
        });
    });

    describe('getPlayerLastPlayed', () => {
        beforeEach(() => {
            (prisma.outcome.findFirst as jest.Mock).mockImplementation(
                (args: {
                    where: {
                        playerId: number,
                        points: { not: null }
                    },
                    take: number,
                    orderBy: { gameDayId: 'desc' },
                    include: { gameDay: true }
                }) => {
                    const playedList = outcomeList.filter(
                        (outcome) => outcome.playerId === args.where.playerId && outcome.points !== null)
                        .sort((a, b) => b.gameDayId - a.gameDayId);
                    const lastPlayed = playedList.slice(0, args.take)[0];
                    return Promise.resolve(lastPlayed || null);
                });
        });

        it('should retrieve the correct last played GameDay for Player ID 1', async () => {
            const result = await outcomeService.getPlayerLastPlayed(1);
            expect(result.gameDayId).toEqual(10);
        });

        it('should return null for Player ID 11', async () => {
            const result = await outcomeService.getPlayerLastPlayed(11);
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create an Outcome', async () => {
            const result = await outcomeService.create(defaultOutcome);
            expect(result).toEqual(defaultOutcome);
        });

        it('should refuse to create an Outcome with invalid data', async () => {
            await expect(outcomeService.create(invalidOutcome)).rejects.toThrow();
        });

        it('should refuse to create an Outcome that has the same GameDay ID and Player ID as an existing one', async () => {
            await expect(outcomeService.create({
                ...defaultOutcome,
                playerId: 1,
                gameDayId: 1,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create an outcome where the combination of GameDay ID and Player ID did not exist', async () => {
            const result = await outcomeService.upsert(defaultOutcome);
            expect(result).toEqual(defaultOutcome);
        });

        it('should update an existing Outcome where the combination of GameDay ID and Player ID already existed', async () => {
            const updatedOutcome = {
                ...defaultOutcome,
                playerId: 1,
                gameDayId: 1,
                response: 'No' as PlayerResponse,
                comment: 'Updated comment',
            };
            const result = await outcomeService.upsert(updatedOutcome);
            expect(result).toEqual(updatedOutcome);
        });

        it('should refuse to create an Outcome with invalid data where the combination of GameDay ID and Player ID did not exist', async () => {
            await expect(outcomeService.create(invalidOutcome)).rejects.toThrow();
        });

        it('should refuse to update an Outcome with invalid data where the combination of GameDay ID and Player ID already existed', async () => {
            await expect(outcomeService.create(invalidOutcome)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing Outcome', async () => {
            await outcomeService.delete(1, 1);
        });

        it('should silently return when asked to delete an Outcome that does not exist', async () => {
            await outcomeService.delete(7, 16);
        });
    });

    describe('deleteAll', () => {
        it('should delete all Outcomes', async () => {
            await outcomeService.deleteAll();
        });
    });
});
