import Image from "next/image";

async function getStatsData() {
  const res = await fetch("https://api.jikan.moe/v4/characters/22615/full", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch statistics data");
  }

  return res.json();
}

export default async function StatsPage() {
  const { data } = await getStatsData();

  return (
    <div className="max-w-6xl mx-auto space-y-20 py-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Media <span className="text-pink-500">&</span> Appearances
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
          Explore the appearances of Haru Urara across anime and manga stories.
        </p>
      </div>

      {/* Anime Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
          <span className="text-2xl">📺</span>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">Anime Series</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <MediaCard 
            href="https://www.youtube.com/playlist?list=PLxSscENEp7JjzK3AD896WNfsfosMcC6pL"
            src="/Uma Musume Pretty Derby.png"
            title="Pretty Derby"
            label="TV Series"
          />
          <MediaCard 
            href="https://www.youtube.com/playlist?list=PLbRq7_wpPI8lJ0y8LbQVMMCETmEItK3Pa"
            src="/Uma Musume Pretty Derby - Road to the Top.png"
            title="Road to the Top"
            label="ONA"
          />
          {data.anime
            .filter((item: any) => item.anime.title !== "UFO Princess Valkyrie 2: Juunigatsu no Yasoukyoku")
            .slice(0, 6)
            .map((item: any) => (
            <MediaCard 
              key={item.anime.mal_id}
              src={item.anime.images.webp.image_url}
              title={item.anime.title}
              label="Appearance"
            />
          ))}
        </div>
      </section>

      {/* Manga Section - Now using the same MediaCard style */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
          <span className="text-2xl">📖</span>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">Manga Stories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <MediaCard 
            href="https://mangadex.org/title/19e83dd3-083b-47a2-a308-8eb56c53df1f/umamusume-pretty-derby-anthology-comic-star"
            src="/Anthology_Comic_Star.png"
            title="Anthology Comic STAR"
            label="Manga"
          />
          <MediaCard 
            href="https://mangadex.org/title/9a5e32cc-c88c-48ad-8685-5de136ad6202/uma-musume-pretty-derby-haru-urara-ganbaru"
            src="/HaruGanbaru.jpg"
            title="Haru Urara Ganbaru!"
            label="Manga"
          />
          {data.manga.slice(0, 2).map((item: any) => (
            <MediaCard 
              key={item.manga.mal_id}
              src={item.manga.images.webp.image_url}
              title={item.manga.title}
              label="Manga"
            />
          ))}
        </div>
      </section>

      {/* Quote Block - Exact Design from Screenshot */}
      <div className="bg-[#f03a5f] p-8 md:p-12 rounded-[32px] text-white shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 mt-10">
        <div className="flex-shrink-0 text-7xl md:text-8xl drop-shadow-md">
          🌸
        </div>
        <div className="flex-grow space-y-4 text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold italic tracking-tight mb-4">
            Pesan Semangat Haru Urara
          </h2>
          <div className="space-y-4">
            <p className="text-lg md:text-[24px] font-bold leading-relaxed opacity-95">
              "Haru Urara tidak pernah menyerah, dan kamu juga tidak boleh menyerah!
              <br />
              Percayalah pada dirimu sendiri!"
            </p>
            <p className="text-sm md:text-base font-bold opacity-80 flex items-center gap-2">
              <span className="inline-block w-6 h-[2px] bg-white opacity-70"></span> Haru Urara
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaCard({ href, src, title, label }: any) {
  const Content = (
    <div className="group space-y-3">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
        <img src={src} alt={title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">{label}</span>
        <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-pink-600 transition-colors">{title}</h3>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">{Content}</a>
  ) : Content;
}