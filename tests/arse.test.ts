import { arse } from '@prisma/client';
import arseService from 'lib/arse';
import prisma from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    arse: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultArse: arse = {
    stamp: new Date(),
    playerId: 12,
    raterId: 12,
    in_goal: 10,
    running: 10,
    shooting: 10,
    passing: 10,
    ball_skill: 10,
    attacking: 10,
    defending: 10,
};

const invalidArse: arse = {
    ...defaultArse,
    playerId: -1,
};

const arseList: arse[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultArse,
    playerId: index % 10 + 1,
    raterId: index + 1,
}));

describe('ArseService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.arse.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                playerId_raterId: {
                    playerId: number,
                    raterId: number
                }
            }
        }) => {
            const arse = arseList.find((arse) => arse.playerId === args.where.playerId_raterId.playerId && arse.raterId === args.where.playerId_raterId.raterId);
            return Promise.resolve(arse ? arse : null);
        });

        (prisma.arse.create as jest.Mock).mockImplementation((args: { data: arse }) => {
            const arse = arseList.find((arse) => arse.playerId === args.data.playerId && arse.raterId === args.data.raterId);

            if (arse) {
                return Promise.reject(new Error('Arse already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.arse.upsert as jest.Mock).mockImplementation((args: {
            where: {
                playerId_raterId: {
                    playerId: number,
                    raterId: number
                }
            },
            update: arse,
            create: arse,
        }) => {
            const arse = arseList.find((arse) => arse.playerId === args.where.playerId_raterId.playerId && arse.raterId === args.where.playerId_raterId.raterId);

            if (arse) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.arse.delete as jest.Mock).mockImplementation((args: {
            where: {
                playerId_raterId: {
                    playerId: number,
                    raterId: number
                }
            }
        }) => {
            const arse = arseList.find((arse) => arse.playerId === args.where.playerId_raterId.playerId && arse.raterId === args.where.playerId_raterId.raterId);
            return Promise.resolve(arse ? arse : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct arse for player 6, rater 16', async () => {
            const result = await arseService.get(6, 16);
            expect(result).toEqual({
                ...defaultArse,
                playerId: 6,
                raterId: 16,
                stamp: expect.any(Date)
            } as arse);
        });

        it('should return null for player 7, rater 16', async () => {
            const result = await arseService.get(7, 16);
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.arse.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(arseList.filter((arse) => arse.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct arses for player id 1', async () => {
            const result = await arseService.getByPlayer(1);
            expect(result.length).toEqual(10);
            for (const arseResult of result) {
                expect(arseResult).toEqual({
                    ...defaultArse,
                    playerId: 1,
                    raterId: expect.any(Number),
                    stamp: expect.any(Date)
                } as arse);
            }
        });

        it('should return an empty list when retrieving arses for player id 11', async () => {
            const result = await arseService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getByRater', () => {
        beforeEach(() => {
            (prisma.arse.findMany as jest.Mock).mockImplementation((args: { where: { raterId: number } }) => {
                return Promise.resolve(arseList.filter((arse) => arse.raterId === args.where.raterId));
            });
        });

        it('should retrieve the correct arses for rater id 1', async () => {
            const result = await arseService.getByRater(1);
            expect(result.length).toEqual(1);
            for (const arseResult of result) {
                expect(arseResult).toEqual({
                    ...defaultArse,
                    playerId: expect.any(Number),
                    raterId: 1,
                    stamp: expect.any(Date)
                } as arse);
            }
        });

        it('should return an empty list when retrieving arses for rater id 101', async () => {
            const result = await arseService.getByRater(101);
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.arse.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(arseList);
            });
        });

        it('should return the correct, complete list of 100 arses', async () => {
            const result = await arseService.getAll();
            expect(result.length).toEqual(100);
            expect(result[11].playerId).toEqual(2);
            expect(result[41].stamp).toEqual(expect.any(Date));
        });
    });

    describe('create', () => {
        it('should create an arse', async () => {
            const result = await arseService.create(defaultArse);
            expect(result).toEqual(defaultArse);
        });

        it('should refuse to create an arse with invalid data', async () => {
            await expect(arseService.create(invalidArse)).rejects.toThrow();
        });

        it('should refuse to create an arse that has the same player ID and rater ID as an existing one', async () => {
            await expect(arseService.create({
                ...defaultArse,
                playerId: 6,
                raterId: 16,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create an arse where the combination of player ID and rater ID did not exist', async () => {
            const result = await arseService.upsert(defaultArse);
            expect(result).toEqual(defaultArse);
        });

        it('should update an existing arse where the combination of player ID and rater ID already existed', async () => {
            const updatedArse = {
                ...defaultArse,
                playerId: 6,
                raterId: 16,
                in_goal: 7,
            };
            const result = await arseService.upsert(updatedArse);
            expect(result).toEqual(updatedArse);
        });

        it('should refuse to create an arse with invalid data where the combination of player ID and rater ID did not exist', async () => {
            await expect(arseService.create(invalidArse)).rejects.toThrow();
        });

        it('should refuse to update an arse with invalid data where the combination of player ID and rater ID already existed', async () => {
            await expect(arseService.create(invalidArse)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing arse', async () => {
            await arseService.delete(6, 16);
        });

        it('should silently return when asked to delete an arse that does not exist', async () => {
            await arseService.delete(7, 16);
        });
    });

    describe('deleteAll', () => {
        it('should delete all arses', async () => {
            await arseService.deleteAll();
        });
    });
});
