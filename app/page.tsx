// Next
import Image from "next/image";

// UI
import ButtonMenu from "./ButtonMenu";

export default function Home() {
  return (
    <main className="[min-height:100dvh] w-full flex flex-col items-center justify-start bg-[url('/background.svg')] bg-no-repeat bg-top">
      <Image
        src="/logo.png"
        width={500}
        height={500}
        alt="Phygital logo"
        className="m-12 px-16"
        priority={true}
        loading="eager"
      />
      <ButtonMenu />
    </main>
  );
}
