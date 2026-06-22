export interface LessonSection {
  heading?: string
  body: string
}

export interface Lesson {
  slug: string
  title: string
  subtitle: string
  topic: string
  difficulty: 1 | 2 | 3 | 4 | 5
  readingMinutes: number
  sections: LessonSection[]
  takeaway: string
}

export const LESSONS: Lesson[] = [
  {
    slug: 'anatomy-of-a-quote-card',
    title: 'Anatomy of a Quote Card',
    subtitle: 'Why the most-shared political "quotes" on your feed are also the easiest to fake.',
    topic: 'Fabricated quotes',
    difficulty: 1,
    readingMinutes: 4,
    sections: [
      {
        body:
          'Open any Philippine political Facebook group on any given day and you will find quote cards — a politician\'s photograph next to a punchy line in bold type, designed to be screenshotted and reshared. They are powerful because they look like evidence. They are dangerous because they almost never are.',
      },
      {
        heading: 'The four-second forgery',
        body:
          'A working quote card takes under five minutes in Canva. Pull a stock photo. Add a quote — invented, mistranslated, or stripped of context. Pick a serif font and a brand color. Done. There is no verification layer between the designer and your group chat.',
      },
      {
        heading: 'What a real quote needs',
        body:
          'Genuine quotes have a paper trail: a video clip with a timestamp, a press conference transcript, an article from a publication you can open and search, or an official statement on the person\'s verified account. A graphic that gestures at sources ("CNN said") without linking them is performing trustworthiness, not earning it.',
      },
      {
        heading: 'A reading habit, not a one-time check',
        body:
          'Train yourself: every time a quote card stops your scroll, before you react, before you share, before you even finish reading, ask one question — "Where is this from?" If the answer is "I do not know," treat the claim as unverified. Reshare nothing on the basis of a quote card alone.',
      },
    ],
    takeaway:
      'Treat every quote card as a claim, not as evidence. The burden of proof is on the graphic — not on you to disprove it.',
  },
  {
    slug: 'the-recycled-flood-photo',
    title: 'The Recycled Flood Photo',
    subtitle: 'How old typhoon images keep coming back as breaking news.',
    topic: 'Recontextualized imagery',
    difficulty: 2,
    readingMinutes: 5,
    sections: [
      {
        body:
          'Every typhoon season, the same handful of photographs go viral again — usually a dramatic image of a flooded street, a roof torn off, or a stranded family on a rooftop. Some are from Ondoy in 2009. Some are from Yolanda. Some are from a flood in Bangkok or Jakarta entirely. They circulate because they look exactly like what we expect a Philippine typhoon to look like.',
      },
      {
        heading: 'Why this pattern works',
        body:
          'Recontextualized images exploit a real audience hunger for information during disasters. People want to know what is happening to their family, their neighborhood, their commute. Old photos labeled as new fill that gap with something emotionally satisfying — and almost always wrong about scale, location, or severity.',
      },
      {
        heading: 'The reverse image search habit',
        body:
          'A reverse image search takes ten seconds and breaks most recycled-image disinfo on the spot. On desktop: right-click → Search image. On mobile: long-press the image, then "Search Google for this image" or paste into images.google.com. If the photo appears in articles from 2009, 2013, or last year — you have your answer.',
      },
      {
        heading: 'During an actual emergency',
        body:
          'In a real crisis, the most reliable sources are NDRRMC, PAGASA, MMDA, and the local LGU\'s verified pages — not your tito\'s Messenger group. Bookmark these now. When information becomes urgent, you do not want to be searching for sources for the first time.',
      },
    ],
    takeaway:
      'A dramatic photo without a date and a source is a claim about reality, not a record of it. Reverse-image-search before you share.',
  },
  {
    slug: 'spotting-coordinated-comments',
    title: 'Spotting Coordinated Comments',
    subtitle: 'The signatures of "troll farms" and what to do when you find one.',
    topic: 'Coordinated inauthentic behavior',
    difficulty: 3,
    readingMinutes: 6,
    sections: [
      {
        body:
          'The Philippines has been described — in academic papers and in reporting by Rappler, the New York Times, and others — as a global testing ground for paid online influence operations. The most visible product of these operations is not a viral lie. It is a comment section.',
      },
      {
        heading: 'The signatures',
        body:
          'Look for: identical or near-identical wording across multiple comments; bursts of comments arriving within minutes of each other; accounts with generic names, few personal posts, and stock-photo profile pictures; arguments that pivot quickly from the topic to attacking the messenger; and replies in clean sentence-case English on posts where organic comments are in Taglish and emoji-heavy. None of these alone is proof. Two or three together is a pattern.',
      },
      {
        heading: 'Why arguing back rarely helps',
        body:
          'Engagement is the currency. Every reply, quote-tweet, or screenshot extends the reach of the original post — including yours. The accounts are not there to be persuaded; they are there to drive a number upward.',
      },
      {
        heading: 'What does help',
        body:
          'Report the accounts using the platform\'s "fake account" or "coordinated behavior" report flow. Screenshot the pattern for your own records. If you have a meaningful audience, publish the pattern as a thread on its own — not as a reply. Starve the original of engagement.',
      },
    ],
    takeaway:
      'Coordinated inauthentic behavior dies in silence and grows on argument. Document, report, and refuse to feed it.',
  },
]

export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug)
}
