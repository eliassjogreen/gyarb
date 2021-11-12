render:
	pandoc                              \
		--standalone                      \
		--reference-doc reference.docx    \
		--from markdown                   \
		--to docx                         \
		--lua-filter pagebreak.lua        \
		--citeproc                        \
		--output paper.docx               \
		paper.md
