import Table from 'components/Table';
import { notFound } from 'next/navigation';
import gameDayService from 'services/GameDay';
import config from 'lib/config';
import { getYearName } from 'lib/utils';
import GameYears from 'components/GameYears';
import { FootyTable } from 'lib/swr';

/**
 * Generates a qualified table name based on the provided table type and year.
 * @param {FootyTable} table - The type of table.
 * @param {number} year - The year for which the table is generated.
 * @returns {string} - The qualified table name.
 */
function QualifiedTableName(table: FootyTable, year: number): string {
    let tableName = "";
    switch (table) {
        case FootyTable.speedy:
            tableName = 'Captain Speedy';
            break;
        case FootyTable.stalwart:
            tableName = 'Stalwart Standings';
            break;
        default:
            tableName = table.charAt(0).toUpperCase() + table.slice(1) + ' Table';
    }

    return `${getYearName(year)} ${tableName}`;
}

/**
 * Generates a name for an qualified table name based on the provided table type
 * and year: if no qualification is applicable then it returns null.
 * @param {FootyTable} table - The type of table.
 * @param {number} year - The year for which the table is generated.
 * @returns {string} - The qualified table name or null.
 */
function UnqualifiedTableName(table: FootyTable): string | null {
    switch (table) {
        case FootyTable.averages:
            return `Played Fewer than ${config.minGamesForAveragesTable} Games`;
        case FootyTable.speedy:
            return `Responded Fewer than ${config.minRepliesForSpeedyTable} Times`;
        default:
            return null;
    }
}

export default async function Page({
    params,
}: {
    params: { params: string[] },
}): Promise<JSX.Element> {
    let year = 0;
    let table = FootyTable.points;

    switch (params.params.length) {
        case 2:
            year = params.params[1] ? parseInt(params.params[1]) : 0;
            if (isNaN(year)) {
                return notFound();
            }
            else {
                const distinctYears = await gameDayService.getAllYears();
                if (!distinctYears || !distinctYears.includes(year)) {
                    return notFound();
                }
            }
        // falls through
        case 1:
            table = FootyTable[params.params[0] as keyof typeof FootyTable];
            if (!table) {
                return notFound();
            }
            break;
        default:
            return notFound();
    }

    if (UnqualifiedTableName(table)) {
        return (
            <div>
                <GameYears />
                <p className="text-2xl font-bold">{QualifiedTableName(table, year)}</p>
                <Table table={table} year={year} qualified={true} />
                <p className="text-2xl font-bold">{UnqualifiedTableName(table)}</p>
                <Table table={table} year={year} qualified={false} />
            </div>
        );
    }
    else {
        return (
            <div>
                <GameYears />
                <p className="text-2xl font-bold">{QualifiedTableName(table, year)}</p>
                <Table table={table} year={year} />
            </div>
        );
    }
}
