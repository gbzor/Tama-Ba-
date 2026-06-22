export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  topic: string
  difficulty: 1 | 2 | 3 | 4 | 5
  prompt: string
  scenario?: string
  options: QuizOption[]
  explanation: string
  tactic: string // The disinfo technique being tested
}

/**
 * Questions are written from real Philippine disinformation patterns,
 * not generic Western fact-check examples. Sources for the tactics:
 * Rappler, VERA Files, Tsek.ph fact-check archives.
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'flood-photo-recontext',
    topic: 'Recontextualized images',
    difficulty: 2,
    prompt: 'Which post shows signs of a recontextualized photo?',
    scenario:
      'Two posts about a typhoon hitting Metro Manila are shared in your group chat within minutes of each other.',
    options: [
      {
        id: 'a',
        text:
          'Post A — "Ongoing rescue operations sa Marikina. 12 households evacuated as of 8 AM. (Source: NDRRMC bulletin)" — with a photo dated today.',
        isCorrect: false,
      },
      {
        id: 'b',
        text:
          'Post B — "GRABE ang baha sa Manila ngayon! Tubig hanggang bubong! Share to warn your family!" — with a dramatic photo, no date, no source.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Both posts are equally reliable since they describe the same event.',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Neither — typhoon posts always need a TV news clip to be trustworthy.',
        isCorrect: false,
      },
    ],
    explanation:
      'Post B uses three classic recontextualization signals: emotional urgency ("GRABE", "Share to warn"), no source citation, and no date. Filipino typhoon disinfo often recycles dramatic photos from older floods (Ondoy 2009, Ulysses 2020) and passes them off as current. Always reverse-image-search before sharing.',
    tactic: 'Recontextualized imagery + emotional manipulation',
  },
  {
    id: 'cnn-screenshot',
    topic: 'Fake news screenshots',
    difficulty: 2,
    prompt:
      'A viral post is a screenshot of what looks like a "CNN Philippines" article making a sensational claim. What is the FIRST thing to verify?',
    options: [
      {
        id: 'a',
        text: 'Check if CNN Philippines exists.',
        isCorrect: false,
      },
      {
        id: 'b',
        text:
          'Go directly to the outlet\'s website and search for the headline yourself.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Read the comments — if many people agree, it is probably true.',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Look at how many shares it has.',
        isCorrect: false,
      },
    ],
    explanation:
      'Fabricated news screenshots are one of the most common Philippine disinfo formats — easy to make in any image editor, hard to verify at a glance. The fastest test: go to the outlet\'s actual site and search the headline. If the story does not exist there, the screenshot is fabricated. Note: CNN Philippines stopped broadcasting in 2024, which itself is being exploited — recent screenshots claiming to be from "CNN Philippines" are immediate red flags.',
    tactic: 'Fabricated news screenshot',
  },
  {
    id: 'ai-image-tells',
    topic: 'AI-generated imagery',
    difficulty: 3,
    prompt:
      'A photo claims to show a Philippine senator at an event yesterday. Which clue most reliably suggests it is AI-generated?',
    options: [
      {
        id: 'a',
        text: 'The background is detailed and realistic.',
        isCorrect: false,
      },
      {
        id: 'b',
        text:
          'Hands or fingers look distorted — wrong number, melted-together, or impossible angles.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'The colors are vivid.',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'The lighting is even across the scene.',
        isCorrect: false,
      },
    ],
    explanation:
      'Hands remain the single most reliable AI tell as of 2026 — diffusion models still struggle with finger counts, joint placement, and how hands interact with held objects. Other tells: jewelry that fuses with skin, text on signs that becomes gibberish at close inspection, and shadows that fall the wrong direction. Pair visual inspection with a reverse image search.',
    tactic: 'AI-generated media',
  },
  {
    id: 'quote-card',
    topic: 'Fabricated quote cards',
    difficulty: 1,
    prompt:
      'A quote card shows: [Senator X\'s photo] + a controversial statement in big letters + no source link, no video, no article. What is the safest assumption?',
    options: [
      {
        id: 'a',
        text: 'Reliable, since the photo matches the person.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Likely fabricated — treat as unverified until you find video or a transcript.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Reliable if many accounts are sharing it.',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Reliable if it comes from a verified account.',
        isCorrect: false,
      },
    ],
    explanation:
      'Quote cards are trivially easy to fake — anyone with Canva can produce one in two minutes. Without a video clip, official press release, or transcript link, treat any quote card as a claim, not as evidence. Quote cards drive a huge share of Philippine political disinformation precisely because they exploit our reading habits: we trust what looks designed.',
    tactic: 'Fabricated quote card',
  },
  {
    id: 'coordinated-posting',
    topic: 'Coordinated inauthentic behavior',
    difficulty: 3,
    prompt:
      'Five different Facebook accounts post the exact same paragraph praising (or attacking) a candidate within 10 minutes. The accounts have generic names and few personal posts. This is most likely:',
    options: [
      {
        id: 'a',
        text: 'Genuine grassroots enthusiasm.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Coordinated inauthentic behavior — likely scripted or paid.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'A coincidence.',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'A trending topic spreading organically.',
        isCorrect: false,
      },
    ],
    explanation:
      'Identical copy across multiple accounts in a short window is the textbook signature of coordinated inauthentic behavior — often called "troll farms" or "click armies" in Philippine reporting. Real grassroots reactions vary in wording, length, grammar, and emoji use. Tools like CrowdTangle (when available) and even manual searches for unique phrases can surface these networks. Report them; do not amplify by quote-replying.',
    tactic: 'Coordinated inauthentic behavior',
  },
  {
    id: 'historical-revisionism',
    topic: 'Historical revisionism',
    difficulty: 4,
    prompt:
      'A TikTok claims "Philippine GDP grew 7% every year during the entire Martial Law period." How should you verify?',
    options: [
      {
        id: 'a',
        text: 'Trust it if the creator has many followers.',
        isCorrect: false,
      },
      {
        id: 'b',
        text:
          'Check primary sources: World Bank, Philippine Statistics Authority, or peer-reviewed economic histories.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Ask in the comments if anyone has a counter-source.',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Compare it to other TikToks on the same topic.',
        isCorrect: false,
      },
    ],
    explanation:
      'Historical claims need historical sources — not other social media posts. World Bank data, the Philippine Statistics Authority, and academic economic histories give the actual record (which, for the late Martial Law years, includes a major recession and the 1983–1985 economic collapse). Cross-referencing primary sources is the single skill that breaks most revisionist content.',
    tactic: 'Historical revisionism',
  },
  {
    id: 'too-good-headline',
    topic: 'Engagement bait',
    difficulty: 1,
    prompt:
      '"Government to give P10,000 ayuda to all Filipinos next week! Click here to register!" appears on your feed from an unfamiliar page. What do you do?',
    options: [
      {
        id: 'a',
        text: 'Click the link to register before the slots run out.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Share with family so they do not miss out.',
        isCorrect: false,
      },
      {
        id: 'c',
        text:
          'Check the official DSWD or Malacañang website / verified social accounts before doing anything.',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'Trust it because the page name sounds official.',
        isCorrect: false,
      },
    ],
    explanation:
      'Fake ayuda posts are a leading vector for phishing and identity theft in the Philippines. They exploit real economic pressure and the legitimate existence of government cash assistance programs. Rule: any "register here" link asking for personal information should be verified against the actual agency\'s official channels first — never through the link itself.',
    tactic: 'Phishing via fake government program',
  },
]

export function getQuestionById(id: string): QuizQuestion | undefined {
  return QUESTIONS.find((q) => q.id === id)
}

export function getRandomQuestion(exclude?: string[]): QuizQuestion {
  const pool = exclude ? QUESTIONS.filter((q) => !exclude.includes(q.id)) : QUESTIONS
  const list = pool.length > 0 ? pool : QUESTIONS
  return list[Math.floor(Math.random() * list.length)]
}
