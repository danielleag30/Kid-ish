import { Link } from 'react-router-dom'
import loreData from '../data/lore.json'

function groupByChapter(data) {
  const map = new Map()
  for (const entry of data) {
    if (!map.has(entry.chapter)) map.set(entry.chapter, [])
    map.get(entry.chapter).push(entry)
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0])
}

export default function Storyline() {
  const chapters = groupByChapter(loreData)

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-[#2a3450]">
        <h1 className="text-2xl font-bold text-white uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          The Fortnite Story
        </h1>
        <p className="text-gray-400 text-xs mt-0.5">Every chapter, told by Jonesy</p>
      </div>

      {chapters.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 px-8 text-center">
          <p className="text-5xl">📖</p>
          <h2 className="text-white text-xl font-bold"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Lore coming soon
          </h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Jonesy is writing the Fortnite story! Check back once the chapters are added.
          </p>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-4 flex flex-col gap-3">
          {chapters.map(([chapterNum, entries]) => (
            <Link
              key={chapterNum}
              to={`/lore/${chapterNum}`}
              className="bg-[#1a2236] border border-[#2a3450] rounded-xl p-4 flex items-center justify-between active:opacity-70 transition-opacity"
            >
              <div>
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider"
                   style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Chapter {chapterNum}
                </p>
                <p className="text-white font-semibold mt-0.5 leading-tight">
                  {entries.length === 1
                    ? entries[0].title
                    : `${entries.length} seasons`}
                </p>
              </div>
              <span className="text-gray-500 text-xl">›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
