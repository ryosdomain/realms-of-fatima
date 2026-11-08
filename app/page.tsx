import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function Books() {
  await connection(); // "wait for a real request before running this"
  const supabase = await createClient();
  const { data, error } = await supabase.from("books").select("*");
  return <pre>{JSON.stringify({ data, error }, null, 2)}</pre>;
}


import ModernBookCard from "@/components/MordernBookCard";
import { ArrowRight, ChevronRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
const books = [
  {
    title: "The Quiet Between Stars",
    genre: "Literary fiction",
    chapters: 12,
    readTime: "1 hr 48 min",
    synopsis:
      "A letter from twenty years ahead sends Mara north toward a past she thought she had left behind.",
    color: "from-[#1a3c35] to-[#31594e]",
    accent: "#d8a651",
    status: "Published",
  },
  {
    title: "A Map of Small Things",
    genre: "Short stories",
    chapters: 8,
    readTime: "54 min",
    synopsis:
      "Eight intimate stories about the ordinary objects that quietly hold a lifetime of memory.",
    color: "from-[#a8583c] to-[#71372a]",
    accent: "#f1d8b5",
    status: "Published",
  },
  {
    title: "Letters from Elsewhere",
    genre: "Magical realism",
    chapters: 5,
    readTime: "42 min",
    synopsis:
      "Letters begin arriving from a town that exists on no map—and each one knows her name.",
    color: "from-[#53657d] to-[#2e394c]",
    accent: "#e4c982",
    status: "Draft",
  },
  {
    title: "The Winter Orchard",
    genre: "Novella",
    chapters: 14,
    readTime: "2 hr 10 min",
    synopsis:
      "An abandoned orchard, a family promise, and one last winter to uncover what was buried.",
    color: "from-[#5f4238] to-[#372823]",
    accent: "#dba66f",
    status: "Published",
  },
];

const chapters = [
  ["01", "The Last Train North", "8 min read"],
  ["02", "A Light in the Valley", "11 min read"],
  ["03", "Things We Left Behind", "9 min read"],
  ["04", "The Shape of Morning", "13 min read"],
];

const storyPages = [
  {
    chapter: "Chapter One",
    title: "The Last Train North",
    kicker: "On departures, old names, and a letter that should not exist",
    paragraphs: [
      "The train left the city at six minutes past midnight, carrying twenty-three passengers and one letter that should not have existed.",
      "Mara noticed it somewhere beyond Bellweather, when the lights of the last station had faded into the dark. It sat on the empty seat opposite her—cream paper, blue ink, her name written in a hand she knew as well as her own.",
      "Because it was her own.",
      "Outside, the northern fields unspooled beneath a moonless sky. Inside, the carriage hummed softly, keeping its small collection of strangers suspended between where they had been and wherever they were going. A child slept against his mother's coat. Two rows ahead, a man turned the same newspaper page for the third time.",
      "Mara looked at the envelope again. Her name was followed by the address of the house in which she had grown up, though the house had been empty for nineteen years. There was no stamp. No postmark. Only a small drawing of a star in the lower corner.",
      "She reached for it, then stopped. There are moments in a life that divide everything cleanly into before and after. She understood, with no sensible reason, that this was one of them.",
      "The train entered a tunnel. Her reflection vanished from the window, and for eleven long seconds there was nothing in the glass but darkness.",
    ],
  },
  {
    chapter: "Chapter One",
    title: "A Familiar Hand",
    kicker: "The letter, continued",
    paragraphs: [
      "When the carriage came back into the world, the letter was still there.",
      "Mara picked it up. The paper was heavy and warm, as if someone had held it just before placing it on the seat. She turned it over. The seal had been pressed with a plain brass button—the sort that had fastened her father's winter coat.",
      "She had kept that button in a small wooden box for years. It was at home now, three hundred miles behind her.",
      "The sensible thing would have been to call the conductor. The sensible thing would have been to ask the other passengers if they had seen anyone sit across from her. Instead, she slid one finger beneath the flap and broke the seal.",
      "Dear Mara, the letter began. If this has found you, you are on the northbound train and it is raining in a city you have finally decided to leave. You will think the handwriting is a trick. It is not.",
      "She stopped reading. Around her, the carriage kept its indifferent rhythm. Wheel, rail, wheel, rail. The sleeping child sighed. Somewhere in the next car, glass chimed against glass.",
      "At the bottom of the page, beneath three closely written paragraphs, was a date twenty years from tomorrow.",
    ],
  },
  {
    chapter: "Chapter One",
    title: "What the Letter Knew",
    kicker: "Some truths arrive before we are ready",
    paragraphs: [
      "The letter knew about the blue cup she had broken that morning. It knew about the key beneath the loose tile in the kitchen and the photograph she had left facedown on the hall table.",
      "It knew that she had nearly missed the train.",
      "These were not secrets, exactly. They were smaller than secrets: the unnoticed pieces from which a life is made. But no one else could have gathered them into this particular shape.",
      "Mara read the first page twice, then folded it along its original crease. There were two more sheets inside the envelope. She did not take them out.",
      "Across the aisle, the man with the newspaper lowered it. He was old, though not in the frail way. His face had the weathered patience of a harbour wall.",
      "“Bad news?” he asked.",
      "Mara closed her hand around the envelope. “I don't know yet.”",
      "The old man nodded as if this were the answer he had expected. “Most news is like that at first.” Then he raised the paper again, giving her back her privacy.",
    ],
  },
  {
    chapter: "Chapter One",
    title: "The First Instruction",
    kicker: "Mile 142, somewhere north of Bellweather",
    paragraphs: [
      "The second sheet contained only four lines.",
      "At one thirteen in the morning, the train will slow beside a signal house with a red door. You must look through the window on the eastern side. You will see a light in the upper room.",
      "Do not look away.",
      "Mara checked the time. One eleven.",
      "The fields outside had become forest, the trees crowding close to the track. She crossed to the other side of the carriage and wiped a clear circle in the misted window with her sleeve.",
      "At first there was only her reflection: pale face, dark hair, the white collar of her shirt. Then the brakes whispered beneath the floor. The train began to slow.",
      "Between the trees, a red door appeared. Above it, in a single square window, a light was burning.",
      "Someone stood behind the glass.",
    ],
  },
];
const home = () => {
  return (
    

      <div>
        <main>
          <HeroSection storyPages={storyPages}/>
          <section className="bg-[#183a31] px-5 py-16 text-[#f4efe4] md:px-10 md:py-24">
            <div className="mx-auto max-w-310">
              <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end">
                <div>
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#d2a55f]">
                    Continue the journey
                  </p>
                  <h2 className="font-serif text-4xl tracking-[-0.035em] md:text-5xl">
                    Inside this story
                  </h2>
                </div>
                <button className="flex items-center gap-2 self-start text-sm font-semibold text-white/75 transition hover:text-white md:self-auto">
                  View all chapters <ArrowRight size={16} />
                </button>
              </div>
              <div className="divide-y divide-white/10">
                {chapters.map(([number, title, time], index) => (
                  <button
                    key={number}
                    className="group grid w-full grid-cols-[50px_1fr_auto] items-center gap-4 py-6 text-left"
                  >
                    <span className="font-serif text-lg text-[#d2a55f]">
                      {number}
                    </span>
                    <span>
                      <span className="block font-serif text-xl transition group-hover:translate-x-1 md:text-2xl">
                        {title}
                      </span>
                      <span className="mt-1 block text-xs text-white/45">
                        Chapter {index + 1}
                      </span>
                    </span>
                    <span className="flex items-center gap-4 text-xs text-white/45">
                      <span className="hidden sm:block">{time}</span>
                      <span className="grid size-9 place-items-center rounded-full border border-white/15 transition group-hover:border-[#d2a55f] group-hover:text-[#d2a55f]">
                        <ChevronRight size={16} />
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="px-5 py-20 md:px-10 md:py-28">
            <div className="mx-auto max-w-310 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a45134]">
                From the library
              </p>
              <h2 className="mx-auto mt-4 max-w-xl font-serif text-4xl tracking-[-0.035em] text-[#183a31] md:text-5xl">
                More places to lose yourself
              </h2>
              <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {books.slice(1).map((book) => (
                  <ModernBookCard key={book.title} book={book} />
                ))}
              </div>
              <button className="mt-14 rounded-full border border-[#18382f]/20 px-7 py-3.5 text-sm font-semibold transition hover:bg-[#183a31] hover:text-white">
                Explore the full library
              </button>
            </div>
          </section>
        </main>
      </div>
    
  );
};

export default home;
