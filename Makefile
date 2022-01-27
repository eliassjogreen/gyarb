.PHONY : all
all: docx pdf

docx:
	pandoc                                   \
		--standalone                           \
		--reference-doc ./paper/reference.docx \
		--from markdown                        \
		--to docx                              \
		--lua-filter pagebreak.lua             \
		--citeproc                             \
		--output ./output/paper.docx           \
		./paper/paper.md

pdf:
	pandoc                                   \
		--standalone                           \
		--template ./paper/template.tex        \
		--from markdown                        \
		--to pdf                               \
		--lua-filter pagebreak.lua             \
		--citeproc                             \
		--output ./output/paper.pdf            \
		./paper/paper.md
