import AzureCache from 'lib/azure';
import { streamToBuffer } from 'lib/utils';

import { getAllIds } from 'lib/countries'
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return getAllIds()
}

export async function GET(
    request: Request,
    { params }: { params: { iso_code: string } }) {
    const { iso_code } = params;

    try {
        const azureCache = AzureCache.getInstance();
        const containerClient = await azureCache.getContainerClient("countries");
        const blobClient = containerClient.getBlobClient(iso_code + ".png");

        if (!(await blobClient.exists())) {
            return notFound();
            // blobClient = containerClient.getBlobClient('manofmystery.jpg');
        }

        const downloadBlockBlobResponse = await blobClient.download(0);
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error('Image body download failed.');
        }
        const imageBuffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

        return new Response(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png'
            },
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
