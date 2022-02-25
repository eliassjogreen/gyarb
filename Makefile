.PHONY : all
all: docx pdf

docx:
	pandoc                                        \
		--standalone                                \
		--reference-doc ./paper/data/reference.docx \
		--from markdown                             \
		--to docx                                   \
		--lua-filter ./paper/data/pagebreak.lua     \
		--citeproc                                  \
		--output ./output/paper.docx                \
		./paper/paper.md

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
