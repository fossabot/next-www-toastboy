import { permanentRedirect } from 'next/navigation';

interface PageProps { }

const Page: React.FC<PageProps> = async () => {
    permanentRedirect(`/footy/table/pub`);
};

export default Page;
