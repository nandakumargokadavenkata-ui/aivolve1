import Image from "next/image";

export default function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 wave-animation opacity-[0.14]">
        <Image
          src="/wave.jpg"
          alt=""
          fill
          priority
          quality={100}
          className="object-cover scale-110"
        />
      </div>
    </div>
  );
}