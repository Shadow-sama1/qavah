export type Verse = {
  verse: number;
  text: string;
};

export type Passage = {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  translation: string;
  verses: Verse[];
};

const books = ["Genesis", "Exodus", "Psalms", "Proverbs", "Isaiah", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "Ephesians", "Philippians", "Hebrews", "James", "1 Peter", "Revelation"];

const passages: Record<string, Verse[]> = {
  "John|3": [
    { verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
    { verse: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." },
    { verse: 18, text: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God." },
  ],
  "Psalms|23": [
    { verse: 1, text: "The Lord is my shepherd; I shall not want." },
    { verse: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
    { verse: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
    { verse: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
    { verse: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
    { verse: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever." },
  ],
  "1 Corinthians|13": [
    { verse: 4, text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up," },
    { verse: 5, text: "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;" },
    { verse: 6, text: "Rejoiceth not in iniquity, but rejoiceth in the truth;" },
    { verse: 7, text: "Beareth all things, believeth all things, hopeth all things, endureth all things." },
    { verse: 8, text: "Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away." },
  ],
  "Philippians|4": [
    { verse: 6, text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God." },
    { verse: 7, text: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
    { verse: 8, text: "Finally, brethren, whatsoever things are true, honest, just, pure, lovely, and of good report; if there be any virtue, and if there be any praise, think on these things." },
  ],
};

export const bookNames = books;

export function findPassage(book: string, chapter: number, verseStart = 1, verseEnd = 999, translation = "KJV"): Passage {
  const verses = passages[`${book}|${chapter}`] ?? [{ verse: verseStart, text: "This passage is ready to be connected to your full local Bible dataset." }];
  const selected = verses.filter((verse) => verse.verse >= verseStart && verse.verse <= verseEnd);
  const result = selected.length ? selected : verses;
  return { book, chapter, verseStart: result[0]?.verse ?? verseStart, verseEnd: result[result.length - 1]?.verse ?? verseEnd, translation, verses: result };
}

export function parseReference(input: string) {
  const normalized = input.trim().replace(/[–—]/g, "-").replace(/\s+/g, " ");
  const match = normalized.match(/^(.+?)\s+(\d+)(?::|\s+)?(\d+)?(?:\s*-\s*(\d+))?$/i);
  if (!match) return null;
  const rawBook = match[1].toLowerCase().replace(/\bjn\b/, "john").replace(/\bps\b/, "psalms").replace(/\bcor\b/, "corinthians");
  const book = books.find((name) => name.toLowerCase() === rawBook || name.toLowerCase().startsWith(rawBook) || rawBook.endsWith(name.toLowerCase())) ?? books.find((name) => name.toLowerCase().includes(rawBook));
  if (!book) return null;
  const chapter = Number(match[2]);
  const verseStart = Number(match[3] ?? 1);
  const verseEnd = Number(match[4] ?? verseStart);
  return { book, chapter, verseStart, verseEnd };
}
