import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export async function GET() {
  try {
    const fontData = await fetch(
      new URL('../../../assets/fonts/StyleScript-Regular.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());

    // const url = new URL(req.url)
    // const parsedValues = ogImageSchema.parse(
    //   Object.fromEntries(url.searchParams)
    // )
    //
    // const { mode, title, description, type } = parsedValues

    return new ImageResponse(
      (
        <div tw="flex flex-col gap-4 w-full h-full items-center justify-center bg-zinc-900">
          <div tw="text-9xl text-slate-50 font-bold">Boutique</div>
          <div tw="text-5xl text-slate-300">built with nextjs</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'StyleScript-Regular',
            data: fontData,
            style: 'normal',
          },
        ],
      },
    );
  } catch (error) {
    console.log(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
