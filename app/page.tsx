// Next
import Image from "next/image";

// UI
import Menu from "./Menu";

export default function Home() {
  return (
    <main className="[min-height:100dvh] w-full flex flex-col items-center justify-start bg-[url('/background.svg')] bg-no-repeat bg-top">
      <Image
        draggable={false}
        src="/logo.png"
        width={500}
        height={500}
        alt="Phygital logo"
        className="m-12 px-16 drop-shadow-[0_0_24px_#00ffff77] select-none"
        priority={true}
        loading="eager"
      />
      <Menu />
    </main>
  );
}
