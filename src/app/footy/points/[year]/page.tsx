import Table from 'components/Table';
import { EnumTable } from 'services/PlayerRecord';

export default async function Page({
    params,
}: {
    params: { year: string },
}): Promise<JSX.Element> {
    const year = parseInt(params.year);

    return (
        <div>
            <p className="text-2xl font-bold">Top 5 players</p>
            <Table table={EnumTable.points} year={year} take={5} />
            <p className="text-2xl font-bold">All players</p>
            <Table table={EnumTable.points} year={year} />
        </div>
    );
}
