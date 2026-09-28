# React Lab

## Code comments

When writing or editing code:

- **File header is the one "what" comment.** The first comment in a file describes what the file is for. Example: `/* Heat pump + AHU matched systems */`
- **Every other comment explains "why," never "what" or "how."** Comment sparingly: only when the implementation reason is crucial and non-obvious. The code itself should show what it does and how.
- **Always use block syntax `/* ... */`.** Never use `//` line comments.
- **Keep it plain.** No decorative characters, banners, long horizontal lines, or dash separators. Example: `/* Comment */`
- **Write in ASD-STE100 (Simplified Technical English) style.** Short sentences (max ~20 words), one idea per sentence, active voice, simple present tense, plain approved words (use "use" not "utilize", "do not" not "don't"). Use software engineering terms and technical names (API, variant ID, query cost, cache) when no simple word says it precisely.
- **Punctuation: one sentence gets no period; two or more sentences end every sentence with a period.** Examples: `/* Sort in code because custom.brand is not adminFilterable */` and `/* Shopify rejects a query above 1000 points. One variant costs about 57 points. */`
- **No history, dates, or counts that go stale.** Git records history. A comment states the current constraint only.
