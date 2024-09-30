import { render, screen } from '@testing-library/react';
import Table from 'components/Table';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { FootyTable, useGameYear } from 'lib/swr';

jest.mock('lib/swr');
jest.mock('components/TableQualified', () => {
    const TableQualified = ({ table, year, qualified }: { table: FootyTable, year: number, qualified?: boolean }) => (
        <div>TableQualified (table: {table}, year: {year}, qualified: {qualified ? "true" : "false"})</div>
    );
    TableQualified.displayName = 'TableQualified';
    return TableQualified;
});

describe('Table', () => {
    const table = FootyTable.points;
    const year = 2010;

    it('renders loading state', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders points table with data', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("2010 Points Table")).toBeInTheDocument();
        expect(screen.getByText("TableQualified (table: points, year: 2010, qualified: false)")).toBeInTheDocument();
    });

    it('renders averages table with data', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={FootyTable.averages} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("2010 Averages Table")).toBeInTheDocument();
        expect(screen.getByText("TableQualified (table: averages, year: 2010, qualified: true)")).toBeInTheDocument();
        expect(screen.getByText("TableQualified (table: averages, year: 2010, qualified: false)")).toBeInTheDocument();
    });

    it('renders stalwart table with data', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={FootyTable.stalwart} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("2010 Stalwart Standings")).toBeInTheDocument();
        expect(screen.getByText("TableQualified (table: stalwart, year: 2010, qualified: false)")).toBeInTheDocument();
    });

    it('renders speedy table with data', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={FootyTable.speedy} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("2010 Captain Speedy")).toBeInTheDocument();
        expect(screen.getByText("TableQualified (table: speedy, year: 2010, qualified: true)")).toBeInTheDocument();
        expect(screen.getByText("TableQualified (table: speedy, year: 2010, qualified: false)")).toBeInTheDocument();
    });

    it('renders pub table with data', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={FootyTable.pub} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("2010 Pub Table")).toBeInTheDocument();
        expect(screen.getByText("TableQualified (table: pub, year: 2010, qualified: false)")).toBeInTheDocument();
    });
});
