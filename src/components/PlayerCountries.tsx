'use client';

import { usePlayerCountries } from 'use/player';
import CountryFlag from './CountryFlag';
import { Loader } from '@mantine/core';

export default function PlayerCountries({ idOrLogin }: { idOrLogin: string }) {
    const { data: countries, error, isLoading } = usePlayerCountries(idOrLogin);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    if (!countries || countries.length === 0) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {countries.map((item: string) => (
                <CountryFlag key={item} isoCode={item} />
            ))}
        </div>
    );
}
