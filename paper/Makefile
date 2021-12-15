docx:
	pandoc                              \
		--standalone                      \
		--reference-doc reference.docx    \
		--from markdown                   \
		--to docx                         \
		--lua-filter pagebreak.lua        \
		--citeproc                        \
		--output paper.docx               \
		paper.md

pdf:
	pandoc                              \
		--standalone                      \
		--template=template.tex           \
		--from markdown                   \
		--to pdf                          \
		--lua-filter pagebreak.lua        \
		--citeproc                        \
		--output paper.pdf                \
		paper.md
