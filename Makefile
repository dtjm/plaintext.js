BUILDDIR=build
MMDDIR=deps/multimarkdown-4
CC=emcc
CCFLAGS=-O2

all: dist/index.js

deps/multimarkdown-4:
	git submodule update --init --recursive

$(MMDDIR)/parser.o:
	git submodule update --init --recursive
	fig run build make -C $(MMDDIR)

build/libmultimarkdown.js: $(MMDDIR)/parser.o
	git submodule update --init --recursive
	mkdir -pv build
	fig run build bash -c "emcc -O2 /src/$(MMDDIR)/*.c -o $@ -s EXPORTED_FUNCTIONS=\"['_mmd_version', '_markdown_to_string']\" -s OUTLINING_LIMIT=10000"

dist/index.js: build/libmultimarkdown.js src/*.js
	mkdir -p dist
	cat src/multimarkdown_header.js build/libmultimarkdown.js src/multimarkdown_footer.js > $@

clean:
	rm -rf build dist deps
