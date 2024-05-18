'use client';

import useSWR from 'swr';

export interface FootyArse {
    in_goal: number,
    running: number,
    shooting: number,
    passing: number,
    ball_skill: number,
    attacking: number,
    defending: number,
}

export interface FootyClub {
    id: number,
    soccerway_id: number,
    club_name: string,
    uri: string,
    country: string,
}

export interface FootyCountry {
    isoCode: string,
    name: string,
}

export interface FootyGameDay {
    id: number,
    year: number,
    date: Date,
    game: boolean,
    mailSent: Date,
    comment: string,
    bibs: FootyTeam,
    picker_games_history: number,
}

export interface FootyOutcome {
    response: FootyResponse,
    responseInterval: number,
    points: number,
    team: FootyTeam,
    comment: string,
    pub: number,
    paid: boolean,
    goalie: boolean,
    gameDayId: number,
    playerId: number,
    gameDay: FootyGameDay,
}

export interface FootyPlayer {
    id: number,
    login: string,
    is_admin: boolean,
    first_name: string,
    last_name: string,
    name: string,
    anonymous: boolean,
    email: string,
    joined: Date,
    finished: Date,
    born: Date,
    comment: string,
    introduced_by: number,
}

export interface FootyPlayerRecord {
    year: number,
    playerId: number,
    name: string,

    P: number,
    W: number,
    D: number,
    L: number,

    points: number,
    averages: number,
    stalwart: number,
    pub: number,
    speedy: number,
}

export enum FootyResponse {
    Yes = 'Yes',
    No = 'No',
    Dunno = 'Dunno',
    Excused = 'Excused',
    Flaked = 'Flaked',
    Injured = 'Injured',
}

export enum FootyTable {
    points = 'points',
    averages = 'averages',
    stalwart = 'stalwart',
    speedy = 'speedy',
    pub = 'pub',
}

export enum FootyTeam {
    A = 'A',
    B = 'B',
}

const fetcher = (input: URL | RequestInfo, init?: RequestInit | undefined) =>
    fetch(input, init).then((res) => res.json());

export function useClub(id: number) {
    return useSWR<FootyClub>(`/api/footy/club/${id}`, fetcher);
}

export function useCountry(isoCode: string) {
    return useSWR<FootyCountry>(`/api/footy/country/${isoCode}`, fetcher);
}

export function useGameYears() {
    return useSWR<number[]>(`/api/footy/gameyear`, fetcher);
}

export function useGameYear(year: number) {
    return useSWR<number>(`/api/footy/gameyear/${year}`, fetcher);
}

export function useGameDay(id: number) {
    return useSWR<FootyGameDay>(`/api/footy/gameday/${id}`, fetcher);
}

export function usePlayer(idOrLogin: string) {
    return useSWR<FootyPlayer>(`/api/footy/player/${idOrLogin}`, fetcher);
}

export function usePlayerLastPlayed(idOrLogin: string) {
    return useSWR<FootyOutcome>(`/api/footy/player/${idOrLogin}/lastplayed`, fetcher);
}

export function usePlayerClubs(idOrLogin: string) {
    return useSWR<number[]>(`/api/footy/player/${idOrLogin}/clubs`, fetcher);
}

export function usePlayerCountries(idOrLogin: string) {
    return useSWR<string[]>(`/api/footy/player/${idOrLogin}/countries`, fetcher);
}

export function usePlayerArse(idOrLogin: string) {
    return useSWR<FootyArse>(`/api/footy/player/${idOrLogin}/arse`, fetcher);
}

export function usePlayerForm(idOrLogin: string, games: number) {
    return useSWR<FootyOutcome[]>(`/api/footy/player/${idOrLogin}/form/${games}`, fetcher);
}

export function usePlayerYearsActive(idOrLogin: string) {
    return useSWR<number[]>(`/api/footy/player/${idOrLogin}/yearsactive`, fetcher);
}

export function usePlayerRecord(idOrLogin: string, year: number) {
    return useSWR<FootyPlayerRecord>(`/api/footy/player/${idOrLogin}/record/${year}`, fetcher);
}

export function useRecords() {
    return useSWR<FootyPlayerRecord[]>(`/api/footy/records`, fetcher);
}

export function useRecordsProgress() {
    return useSWR<[number, number]>(`/api/footy/records/progress`, fetcher);
}

export function useTable(table: FootyTable, year: number, qualified?: boolean, take?: number) {
    let url = `/api/footy/table/${table}/${year}`;
    if (qualified !== undefined) url += `/${qualified}`;
    if (take !== undefined) url += `/${take}`;

    return useSWR<FootyPlayerRecord[]>(url, fetcher);
}

export function useTeam(gameDay: number, team: string) {
    return useSWR<FootyOutcome[]>(`/api/footy/team/${gameDay}/${team}`, fetcher);
}

export function useWinners(table: FootyTable, year?: number) {
    return useSWR<FootyPlayerRecord[]>(`/api/footy/winners/${table}/${year}`, fetcher);
}
