import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start bg-[url('/background.svg')] bg-no-repeat bg-top">
      <Image
        src="/logo.png"
        width={500}
        height={500}
        alt="Phygital logo"
        className="m-12 px-16"
      />
      <div className="grid place-content-center flex-1 w-full"></div>
    </main>
  );
}
