import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haru Urara - Profile",
  description: "Learn about Haru Urara, the pink-haired racing horse who never gives up!",
};

async function getCharacterData() {
  const res = await fetch("https://api.jikan.moe/v4/characters/22615", {
    next: { revalidate: 3600 }, // SSG: Revalidate every hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch character data");
  }

  return res.json();
}

export default async function HomePage() {
  const { data } = await getCharacterData();

  return (
    <div className="animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
        <div className="flex-shrink-0 relative w-64 h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-white transition-transform hover:scale-105 duration-300">
          <Image
            src="/Haru_Urara.png"
            alt="Haru Urara"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex-grow space-y-6">
          <div>
            <span className="text-pink-500 font-bold tracking-widest uppercase text-sm">Profil Karakter</span>
            <h1 className="text-5xl font-extrabold text-pink-600 mt-2">Haru Urara</h1>
            <p className="text-xl text-gray-500 italic mt-1">{data.name_kanji}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
            <h2 className="text-2xl font-bold mb-4 text-pink-500">Tentang Haru Urara</h2>
            <p className="text-lg leading-relaxed whitespace-pre-line text-gray-700">
              Haru Urara adalah salah satu karakter paling ikonik di Uma Musume Pretty Derby. Dia dikenal karena sifatnya yang sangat ceria, optimis, dan tidak pernah menyerah meskipun sering kalah dalam balapan. 
              
              Berdasarkan kuda balap nyata di Jepang yang terkenal karena rekor kekalahannya yang panjang, Haru Urara menjadi simbol harapan dan kegigihan bagi banyak orang. Dia memiliki rambut merah muda yang khas dan selalu membawa energi positif ke mana pun dia pergi!
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
            <h2 className="text-2xl font-bold mb-6 text-pink-500 border-b border-pink-50 pb-2">Trivia</h2>
            <div className="text-lg text-gray-700 space-y-8">
              <div className="relative pl-8">
                <span className="absolute left-0 top-1">🔍</span>
                <p className="font-bold text-pink-700 mb-1">Rahasia No.1:</p>
                <p>Dia tidak bisa mengatakan "prestigious."</p>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-0 top-1">🏇</span>
                <p className="font-bold text-pink-700 mb-3">Pakaian Balap & Realita:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span>Pakaian balap Urara didasarkan pada pakaian olahraga biasa.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span>Arena Balap Kochi menyelenggarakan balapan hingga level Jpn3, sehingga dia tidak mungkin menjalankan balapan G1.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span>Dalam pacuan kuda Jepang lokal, sutra balap bergantung pada joki, bukan pemilik. Karena banyak joki mengendarai Haru Urara, dia tidak memiliki sutra balap tetap.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span>Skema warna pakaiannya berasal dari topeng merah muda-putih yang ia kenakan di kehidupan nyata. Pemiliknya juga menghiasinya dengan patch <strong>Hello Kitty</strong>.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span>Ketika joki legendaris <strong>Yutaka Take</strong> mengendarainya pada balapan ke-106, ia mengenakan sutra balap merah muda.</span>
                  </li>
                </ul>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-0 top-1">🏠</span>
                <p className="font-bold text-pink-700 mb-3">Hubungan & Asrama:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span><strong>King Halo</strong> adalah teman sekamarnya. Hubungan mereka didasarkan pada prinsip "tidak pernah menyerah", apa pun yang terjadi.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span>Penugasan ke Asrama Ritto tergolong unik karena Urara asli tidak pernah ke pusat pelatihan Ritto JRA dan bukan merupakan kuda JRA.</span>
                  </li>
                </ul>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-0 top-1">🎨</span>
                <p className="font-bold text-pink-700 mb-3">Budaya Pop & Komunitas:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span><strong>April 2022:</strong> Penggemar internasional berhasil memasukkan Haru Urara ke kanvas Reddit April Mop, bertahan di bagian utara hingga akhir.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span><strong>The Trail of Miracle:</strong> Pada talk show 2022 di Kochi, Tomoyo Takayanagi (pengisi suara Oguri Cap) menggantikan Yukina Shuto yang berhalangan hadir.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span><strong>Musik:</strong> Grup band <em>Biffy Clyro</em> menamai salah satu lagu di album "The Myth of the Happily Ever After" sesuai namanya.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-pink-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    <span><strong>Nama Mandarin:</strong> Nama Mandarinnya (春丽) ditulis sama dengan karakter <em>Street Fighter</em>, <strong>Chun-Li</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-pink-100 p-4 rounded-xl text-center">
              <span className="block text-pink-600 font-bold text-2xl">0 Wins</span>
              <span className="text-sm text-pink-400 font-medium">Racing Record</span>
            </div>
            <div className="bg-pink-100 p-4 rounded-xl text-center">
              <span className="block text-pink-600 font-bold text-2xl">∞ Spirit</span>
              <span className="text-sm text-pink-400 font-medium">Determination</span>
            </div>
          </div>

          <div className="pt-4 border-t border-pink-100">
            <p className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
              <span>Referensi:</span>
              <a 
                href="https://x.com/uma_musu/status/1552225373860945920" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 underline font-medium transition-colors"
              >
                Uma Musume Official (@uma_musu)
              </a>
              <a 
                href="https://en.wikipedia.org/wiki/Har Poura_(Umamusume:_Pretty_Derby)" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 underline font-medium transition-colors"
              >
                Wikipedia
              </a>
              <a 
                href="https://umamusume.fandom.com/wiki/Haru_Urara" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 underline font-medium transition-colors"
              >
                Uma Musume Fandom
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}