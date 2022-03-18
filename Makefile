.PHONY : all
all: docx pdf

pdf:
	pandoc                                        \
		--standalone                                \
		--pdf-engine=xelatex                        \
		--template ./paper/data/template.tex        \
		--from markdown                             \
		--to pdf                                    \
		--lua-filter ./paper/data/pagebreak.lua     \
		--citeproc                                  \
		--output ./output/paper.pdf                 \
		./paper/paper.md

cli:
	deno compile                                  \
		--allow-all                                 \
		--unstable                                  \
		--output output/gyarb                       \
		src/cli/main.ts
