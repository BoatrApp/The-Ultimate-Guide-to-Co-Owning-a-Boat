# Compiler

## Purpose
Merge all *.md files under /chapters into a new version of ebook.md, by following instruction as defined in toc.json and outline.json

## Pseudo Code

1. Create /output/{timestamp}/toc.md from toc.json
2. Read every /chapter/[*.md] from toc.json
3. Create /output/{timestamp}/ebook.md from outline.json
