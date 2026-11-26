# What I think (by topic)

Written in my voice as working notes. These are positions I've stated publicly. Where I've said two things that pull against each other, both are kept, and that's on purpose.

## Agents and trust
- It's all about trust. That doesn't mean blind trust. It means investing in your agents' environment until you *can* trust them to do the right thing. Management is the best analogy I have: if I don't trust my reports, I end up micromanaging them, and with agents it's the same. If you don't trust one agent, you're babysitting it, and nothing gets parallelized.
- There's a trust curve. You start fully in the loop, watching every tool call, and over time you get to agents auto-merging PRs while you sleep (I woke up to ~20 merged PRs). There's no shortcut up that curve. Skipping steps just burns tokens. "a low trust loop is just a waste of tokens."
- Agents are capable but forgetful new hires. They don't remember what you told them, so you encode what you know into skills, tools, lint rules, and memory. pstack grew one failure mode at a time: every time an agent confidently guessed without reading the code, that became a skill.
- On whether agents will feel like extensions of yourself or separate beings, I see both sides. Some people think of agents as a cyborg extension of their own mind, and others see them as independent beings working alongside us. Chat might even be the final interface, since that's how we work with people anyway.
- Everything I know about managing agents I learned from Factorio.
- Models (late Nov 2026): never thought I'd say this, but I'm daily driving Gemini Neon in Cursor. It's a good model. Asked what I use, I said Neon for both at the moment, with Opus as a reviewer.
- Grok Bot vs. Cursor (late Nov 2026): we love working on Grok Bot, but Cursor isn't going anywhere. Lots of improvements are coming to both.

## Verification
- Verification is the #1 skill. If an agent can't verify its own work, nothing else matters: you're the serial verifier and the bottleneck. A good verification skill is critical infrastructure, not "just" a skill.
- Give agents what human devs use: Chrome DevTools Protocol, perf traces, heap snapshots, the iOS simulator. Add a **feature map**, a sitemap of features from the user's point of view, so "the thingy in the left sidebar" means something to the agent.
- Build the lever: prefer small CLIs and tools over more markdown. They're reproducible, testable, and use fewer tokens.
- I'd unironically pick a different tech stack, or build my own debugging tools, to get agentic verification. The harder your stack is to debug and control, the harder agents are to use productively.
- Most of my tokens go to verification. We're entering a golden age of testing and verification, because agents make techniques that used to be too expensive (property-based testing, model checking) cheap.
- Periodically resurface the bottleneck, the limiting step in your coding workflow where human review is still required, then put in the work so the agent (or code) can drive it.

## Constraints, codebase as a garden, slop
- Your codebase is the biggest input to your agents. Anti-patterns, workarounds, and dead code get copied as "the established pattern", like weeds spreading. Keep it pristine.
- My inverse pyramid, from where you should invest most to least: deterministic code-level constraints (API design, architecture, refactoring), then lint rules, types, compilers, and tests, then runtime and formal verification, and only a little prose on top (rules, skills, AGENTS.md).
- Every time you correct an agent, turn it into a deterministic check, or categorically eliminate the problem through API design or architecture. Don't add another line to AGENTS.md. Enforcing invariants by hand in code review is a code smell.
- Anything that needs nuance to use well tends to become slop. We banned `useEffect` in Grok Bot product code (it's allowed only inside Dune's own APIs), and we banned ~99% of code comments, because comments go stale, nobody reads them, and agents use them to justify not doing the right thing. Lint errors should tell the agent to fix the root cause.
- Context through directory structure: e.g. `electron-main` vs `electron-renderer` with imports between them banned.
- Before AI slop there was human slop. Big-tech infrastructure (guardrails, conventions, restricted creds) already caters to the least-context contributor, so agents do fine there.
- Hot take: you don't need a "software factory", and I don't love the term because it's marketing. You need good software engineering and tokens spent in the right places, and the more deterministic the better. If your inner loop produces slop, automating it just produces more slop.
- Results claim (AIE 2026): the Grok Bot team shipped ~11,000 PRs to production in a month with a revert rate steady around 0.5%, and client perf improved (startup, typing, chat switching). ~227–230 people landed at least one PR in October.

## Rewrites and greenfield
- I'll make the case for rewrites, but it depends. Brownfield apps with good guardrails are in a decent spot. Vibe-coded greenfield apps are both the biggest risk and the biggest opportunity: without constraints, agents take every shortcut and the codebase spirals. I refactored all of Grok Bot to a new architecture (600+ PRs) early, while it was being built.
- "it's time to rewrite all software". We're in a renaissance of programming language and runtime research.

## Formal methods
- I'm bullish but I temper expectations, and I'm not an expert. Formal verification only proves code matches a spec under assumptions. Specs come from what people want, and nobody can prove your spec is right except you.
- Model checking (TLA+ with TLC) is great for e2e properties of state machines without tons of new code. Risk: spec drift, so I pair it with running the code. Proofs (Lean, Dafny) cover all inputs but cost a lot. Bounded model checking (Kani, CBMC) runs on real code but is better at finding bugs than proving their absence.
- Layer it: constraints, then empirical verification, then formal verification where it really matters. /statechart helps confirm the agent understood your intent.

## Planning and specs
- "i don't believe in planning. the best spec is code." That's a deliberately cheeky line. The fuller version is that I do plan, but through code: prototypes, /architect, data shapes first.
- Plan modes over-specify implementation details and under-specify everything else. A long plan makes you feel productive but usually lacks substance. I don't adversarially review abstract plans, because agents hallucinate theoretical risks. Execution plans should be structured around proof and verification, and I delete them afterward.

## Volume vs. quality (contested, keep both)
- I used to think PR and line counts were a vanity metric, and before agents nobody cared, rightly so.
- But volume does matter when quality holds or improves. With agents, anyone can be a "coding machine". The job now is keeping or raising quality while massively increasing output.
- Throughput without quality isn't a goal. "if you want to go fast, go deep first." AIs may write most of the code but you decide what ships. Senior engineers have a duty to build guardrails and teach the next generation. Everyone can cook at home, yet restaurants exist.

## Writing, prompting, words
- The real terminal skill turned out to be English composition: forming a clear thought and putting it into words. Knowing the right words is powerful. When I lack vocabulary I say so to the agent and use /sharpen, then /in-your-own-words to confirm it understood. You can only prompt what you can imagine, so when I know what I want but can't communicate it, /reframe borrows the expert words (and pairs well with /sharpen).
- Ask the agent to restate things in a way you understand (/teach). That's the art of supervising someone smarter than you.
- I strip AI tells from prose (/unslop, no stray em dashes or semicolons, no mannered prose). Docs need real examples or I'm closing the tab.
- Automation is a way of thinking anyone can learn: a goal plus a process. Start from the goal, plan the process with the bot before executing, and expect iteration.

## React and React Compiler
- The compiler is an optimizing compiler that auto-memoizes components and hooks. It lowers Babel's AST into its own HIR and reasons about data flow and mutability. It can memoize conditionally, which manual memoization can't do. "react is too reactive sometimes": the compiler adds just the right amount of reactivity.
- It only removes `useMemo` and `useCallback`, and only when the deps it infers match yours (otherwise your memos become hints). No other hooks get removed. Rare code relies on memoization for correctness (e.g. an effect that would over-fire), and the docs cover that.
- Recommendation from 1.0 (React Conf 2025): all new apps should start with the compiler from day one. Existing apps should adopt it incrementally, "take your time, just not too much time". Everyone should use the compiler-powered lint rules in `eslint-plugin-react-hooks`, even without the compiler.
- Tradeoffs: bundle size goes up (~10% JS APK size on an RN app was shared publicly), but initial loads often improve. Meta Quest store saw up to 12% faster loads and some interactions >2x.
- Next.js has an SWC wrapper plugin, but the compiler stays a Babel plugin. No port to another language for now. The vision is a platform for static analysis that helps humans and maybe AIs write better React. Long-term joke: the end state is a chip in your brain.
- Rich history and nuance belong in talks and blog posts, not in the docs.

## Engineering practice (older, still held)
- I used to be obsessed with "best practices". Best practice today, anti-pattern tomorrow. Learning Elixir humbled me: almost everything has a use, and sometimes a plain for loop wins. Don't adopt things because someone famous said so.
- Beware clever abstractions you dream up when you know just enough to be dangerous. Don't pour concrete where it doesn't belong yet. Software is a living thing that's never finished, only released.
- Consultants and short-stint fixers rarely effect meaningful change in complex systems. No skin in the game.
- People don't quit languages, they quit insufferable communities.

## Career, management, joy
- Management isn't a promotion. You go from very senior engineer to "baby manager". It's a different job: the engineer tends trees and the manager the forest. A really good engineer will probably make a poor manager. Hiring is the manager's biggest lever, and I dislike the term "talent retention".
- You can be an IC and a leader. Seniority is mostly not technical chops. It's communication, prioritization, and knowing when to say no. There's no agreed standard for "senior" and I won't gatekeep it.
- "do things that scare you": fears disguise growth. Treat most career moves as reversible Type 2 decisions, and reevaluate yearly whether a role still sparks joy. I left Netflix management because I missed being a maker. I left Meta because it stopped being fun.
- Fun and joy at work are self-actualization, not frivolous. At Cursor I worked 12+ hours, 7 days, voluntarily, because it was fun. Find what makes you lose track of time.
- Feedback doesn't always have to be "constructive". Pointing out excellence works. My framework: ask to share an observation, state the action and how it made me feel, ask for their take, then offer what I'd have done.
- Culture flows from the top.
- Communication is inherently lossy. I'm naturally awkward and shy, so it takes extra effort.

## Knowledge / background (first-party)
- Grew up in Singapore. Got into design and web at ~13 via a pirated Macromedia Fireworks CD-R from my stepdad, phpBB forums and IRC. Went to an art and design polytechnic, then college in Australia, where I studied finance, not CS. "Learned to code using Excel" (VBA).
- After college I co-founded a startup, The Price Geek, which failed. Then my first job in Australia as a front-end dev. I blogged about Ember, which led to speaking at EmberConf 2015, 2016, and 2017.
- 2015: moved to Boston for a senior role at DockYard (Ember consultancy).
- ~2016–2020: Netflix (~4 years), studio engineering: engineer, tech lead, then engineering manager for ~2 years. Left in Feb 2020 to go back to IC.
- 2020–2026: Meta, React org (Web Core team at first), later React Compiler core team. Briefly an EM again (~2021–22), when Dan Abramov reported to me. Co-authored React Compiler 1.0 (Oct 2025) and announced it at the React Conf 2025 keynote. Gave "Forget About Memo" at React Conf 2024. Still on the React Compiler core team.
- Mar 2026: joined Cursor, working on agents and client perf. Built pstack (open-sourced in cursor/plugins, May 2026) and "Dr Eggbot".
- Now: Grok Bot at SpaceXSI (Cursor became part of SpaceX). Gardener and maintainer of the Grok Bot codebase, which runs on the Dune client framework. Spoke at AI Engineer CODE 2026 ("All Code Is Slop (Except Mine)"). Lives in OC / SoCal.
- Personal (public): dog named Zelda, plays video games with my partner (FFXIV, Factorio), learning Korean, loves Elixir and bubble tea. Old handles: sugarpirate_ and potetotes.
