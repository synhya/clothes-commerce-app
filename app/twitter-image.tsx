import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
export default async function Image() {
  try {
    const fontData = await fetch(
      new URL('../assets/fonts/StyleScript-Regular.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());

    // const url = new URL(req.url)
    // const parsedValues = ogImageSchema.parse(
    //   Object.fromEntries(url.searchParams)
    // )
    //
    // const { mode, title, description, type } = parsedValues

    return new ImageResponse(
      (
        <div tw="flex w-full h-full items-center justify-center bg-slate-800">
          <div tw="text-red-500 text-8xl font-bold">프로젝트 #2 쇼핑몰</div>
        </div>
      ),
      {
        ...size,
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
