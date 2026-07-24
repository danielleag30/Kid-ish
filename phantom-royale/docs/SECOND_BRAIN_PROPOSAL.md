# Phantom Royale Second Brain Proposal

Generated: 2026-06-15

## Executive Recommendation

Build a project-adjacent Obsidian-compatible knowledge layer for Phantom Royale instead of turning the app repo itself into a full personal vault.

The current repo already contains the raw ingredients of a strong second brain:

- Structured product data in `src/data/*.json`
- Agent research reports in `src/data/*REPORT.md` and `public/maps/AGENT_REPORT.md`
- A working React/Vite app that turns that research into a user-facing experience
- A Claude/Codex launch configuration in `.claude/`

What it does not yet have is a stable knowledge architecture that connects sources, claims, confidence, decisions, tasks, and app implementation. The best next step is a lightweight `knowledge/` system inside this repo, designed so it can later be copied into or mounted by a larger Obsidian vault.

## What You Currently Have

### App Layer

The app is a Fortnite companion-style experience with:

- Story/lore browsing through `src/data/lore.json`
- Chapter and season views through `src/pages/Storyline.jsx`, `src/pages/DiscoverTab.jsx`, and `src/pages/ChapterDetail.jsx`
- Reload and Blitz map browsing via `src/data/reload_maps.json`, `src/data/blitz_maps.json`, and `public/maps/`
- Offline/PWA-oriented app structure through Vite, manifest files, and local assets

This is not just a codebase. It is already a content product.

### Knowledge Layer

The current knowledge layer is present but informal:

- `src/data/STORY_AGENT_REPORT.md` records research choices, low-confidence lore entries, and uncertainty.
- `src/data/OVERSEER_REPORT.md` records validation, corrections, YouTube ID changes, and production-readiness checks.
- `public/maps/AGENT_REPORT.md` records map-source provenance, image dimensions, and source repository.
- `public/maps/manifest.json` contains source URLs and asset metadata, but those claims are separated from the lore and app decisions.

These reports are valuable. They should become first-class knowledge notes, not temporary build artifacts.

### Agent Layer

The `.claude/` directory already suggests a workflow where agents operate on the repo. This is a good foundation for a Karpathy-style LLM Wiki pattern:

- Agents read project context.
- Agents update structured files.
- Agents leave reports.
- A human reviews and directs the next pass.

The missing piece is a schema that tells agents where memory lives and how to update it.

## Research Fit

The Karpathy LLM Wiki pattern maps well here:

- Raw sources should be kept immutable.
- Synthesized wiki pages should accumulate over time.
- `index.md`, `hot.md`, and `log.md` should guide agents before they read the whole repo.
- The LLM should maintain cross-links, confidence, contradictions, and summaries.

The Justin Johnson pattern is less a public second-brain vault and more an artifact style: clean research/project pages, papers, code, teaching material, and reproducible outputs. For Phantom Royale, that means every research pass should produce something usable: app copy, data updates, a source note, a decision note, or a QA report.

General Obsidian practice adds the local primitives:

- Markdown files as durable notes
- Wikilinks for concepts, characters, maps, seasons, and decisions
- YAML properties for queryable metadata
- Tags for workflow state
- Canvas for lore timelines, map relationships, and feature planning
- Bases for dashboards over notes with properties

## Proposed Repo Structure

Add a repo-local knowledge system:

```text
knowledge/
  index.md
  hot.md
  log.md
  tag-dictionary.md
  schemas/
    agent-workflows.md
    note-types.md
  inbox/
  raw/
    sources/
    screenshots/
    transcripts/
  wiki/
    product/
    lore/
      chapters/
      seasons/
      characters/
      factions/
      locations/
      events/
      mechanics/
    maps/
    data/
    code/
    decisions/
    sources/
  jobs/
    ingest-source.md
    verify-lore.md
    update-lore-bible.md
    verify-assets.md
    ship-feature.md
    lint-knowledge.md
  outputs/
    briefs/
    copy/
    reports/
  canvases/
  templates/
```

This keeps the knowledge close to the app without polluting `src/` or `public/`.

## Note Types

Use these note types first:

- `project` - Phantom Royale overview, roadmap, active priorities
- `source` - articles, videos, GitHub repos, wiki pages, trailers, source archives
- `season` - one note per Fortnite chapter/season
- `map` - one note per map asset or mode map
- `entity` - characters, factions, locations, mechanics, and external people/teams
- `decision` - product/content/technical decisions and why they were made
- `report` - agent pass summaries, QA findings, validation runs
- `job` - reusable agent instructions

## Recommended Frontmatter

```yaml
---
type: season
project: "[[Phantom Royale]]"
status: validated
confidence: medium
chapter: 6
season: 1
source_count: 3
app_files:
  - src/data/lore.json
  - public/maps/chapter6-season1.jpg
tags:
  - domain/lore
  - status/validated
  - source/official
updated: 2026-06-15
---
```

Keep tags small and operational. Use links for topics.

## Tags

Use this starting taxonomy:

```text
#status/inbox
#status/processing
#status/validated
#status/needs-review
#status/stale

#domain/lore
#domain/maps
#domain/product
#domain/code
#domain/research
#domain/design

#job/ingest
#job/verify
#job/synthesize
#job/build
#job/ship
#job/lint

#source/official
#source/github
#source/wiki
#source/youtube
#source/article
#source/community
```

Avoid deep content tags such as `#fortnite/chapter/6/season/1`. That should be a note link, not a tag.

## Graph Strategy

The graph should answer operational questions:

- Which app data entries have no source note?
- Which low-confidence claims are linked to user-facing copy?
- Which maps have source provenance but no lore relationship?
- Which decisions are not connected to code changes?
- Which reports have not been consolidated into durable wiki pages?

Suggested graph groups:

- Product notes: green
- Lore notes: blue
- Source notes: gray
- Decision notes: orange
- Low-confidence notes: red
- Job notes: purple
- Output notes: pink

## Agent Jobs

### `ingest-source`

Purpose: Convert one raw source into a durable source note and update linked wiki pages.

Steps:

1. Read the raw source.
2. Create or update a `source` note.
3. Extract claims with confidence.
4. Link claims to relevant seasons, maps, characters, events, and product decisions.
5. Append the action to `knowledge/log.md`.

### `verify-lore`

Purpose: Check user-facing lore against sources.

Steps:

1. Read `src/data/lore.json`.
2. Read related season notes.
3. Identify uncited, stale, contradictory, or low-confidence claims.
4. Propose JSON edits only when evidence is clear.
5. Write a report to `knowledge/outputs/reports/`.

### `update-lore-bible`

Purpose: Maintain the creative model.

Steps:

1. Create or update pages for chapters, seasons, characters, factions, locations, mechanics, and events.
2. Keep timelines coherent.
3. Track canon vs interpretation.
4. Mark uncertainty explicitly.

### `verify-assets`

Purpose: Keep maps, icons, audio, and external source metadata trustworthy.

Steps:

1. Check every app-facing asset has provenance.
2. Link map files to source URLs and relevant season notes.
3. Flag missing, stale, or mismatched files.

### `ship-feature`

Purpose: Convert product intent into implementation context.

Steps:

1. Read `knowledge/hot.md`.
2. Read relevant product and code notes.
3. Make scoped code changes.
4. Update decision notes if behavior or product direction changes.
5. Append to `knowledge/log.md`.

### `lint-knowledge`

Purpose: Keep the second brain healthy.

Steps:

1. Find orphan notes.
2. Find reports not consolidated into wiki pages.
3. Find notes missing required frontmatter.
4. Find stale low-confidence claims.
5. Produce a short cleanup checklist.

## Migration Plan

### Phase 1 - Add The Spine

Create:

- `knowledge/index.md`
- `knowledge/hot.md`
- `knowledge/log.md`
- `knowledge/tag-dictionary.md`
- `knowledge/schemas/note-types.md`
- `knowledge/schemas/agent-workflows.md`

This gives agents a reliable starting point.

### Phase 2 - Promote Existing Reports

Turn these into linked notes:

- `src/data/STORY_AGENT_REPORT.md` -> `knowledge/wiki/sources/story-agent-report-2026-06-09.md`
- `src/data/OVERSEER_REPORT.md` -> `knowledge/wiki/sources/overseer-report-2026-06-09.md`
- `public/maps/AGENT_REPORT.md` -> `knowledge/wiki/sources/maps-agent-report-2026-06-09.md`

Keep the original files where they are for now. The knowledge layer should link to them.

### Phase 3 - Create The Lore Bible

Generate notes for:

- `knowledge/wiki/lore/chapters/chapter-1.md` through current chapters
- `knowledge/wiki/lore/seasons/chapter-1-season-1.md` through current seasons
- Core entities: `The Visitor`, `The Seven`, `Zero Point`, `Imagined Order`, `Jones`, `Midas`, `Kevin the Cube`, `Last Reality`, `Cube Queen`, `The Herald`

Each season note should link back to its JSON entry, map file, YouTube ID, source notes, and uncertainty.

### Phase 4 - Create Product Memory

Create:

- `knowledge/wiki/product/phantom-royale.md`
- `knowledge/wiki/product/audience.md`
- `knowledge/wiki/product/content-model.md`
- `knowledge/wiki/product/roadmap.md`
- `knowledge/wiki/code/app-architecture.md`

This is where your product direction lives, separate from code.

### Phase 5 - Optional Obsidian Layer

Once the Markdown spine is useful, open the repo root or `knowledge/` folder as an Obsidian vault. Add:

- Canvas files for lore timelines and map relationships
- Bases dashboards over `type`, `status`, `confidence`, `chapter`, and `season`
- A graph view saved around lore, sources, and app files

## Near-Term Priority

Do not start by installing a large Obsidian template. Start by creating the repo-local `knowledge/` spine and migrating the three existing agent reports. Your current assets are already high-signal; the biggest win is connecting them.

After that, generate season notes from `src/data/lore.json` and map notes from `public/maps/manifest.json`. That will immediately give you a searchable, linkable lore/data brain that agents can maintain.

## Definition Of Done For V1

V1 is successful when:

- Every user-facing lore entry has a corresponding season note.
- Every map asset has a provenance note or source link.
- Every agent report has been consolidated into the wiki.
- `knowledge/hot.md` gives the next agent enough context to work without rereading the entire repo.
- Low-confidence lore claims are visible and queryable.
- Product decisions have their own notes instead of living only in chat history.

