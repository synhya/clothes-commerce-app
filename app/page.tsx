import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Carousel } from '@/components/ui/carousel';
import ClothCarousel from '@/components/page/home/ClothCarousel';

export default function Home() {
  return (
    <main
      data-state="warning"
      className="group flex flex-col items-center justify-between min-h-screen p-24 "
    >
      <div className="group-data-[state=warning]:bg-yellow-600 flex flex-col items-center">
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          className="dark:invert"
          width={200}
          height={200}
        />
        <h1 className="text-4xl font-bold mt-8">Welcome to Next.js</h1>
      </div>
      <ClothCarousel slides={[1,2,3,4,5]}/>
    </main>
  );
}
