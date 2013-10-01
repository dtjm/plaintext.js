BUILDDIR=build
MMDDIR=deps/multimarkdown-4
CC=deps/emscripten/emcc
CCFLAGS=-O2

all: dist/plaintext.js

deps/multimarkdown-4:
	git submodule init
	git submodule update
	(cd $(MMDDIR); git submodule init; git submodule update)

$(MMDDIR)/parser.c:
	(cd $(MMDDIR); git submodule init; git submodule update)
	make -C $(MMDDIR)

build/libmultimarkdown.js: $(MMDDIR)/parser.c
	(cd $(MMDDIR); git submodule init; git submodule update)
	mkdir -p build
	$(CC) -O2 $(MMDDIR)/*.c -o $@ -s EXPORTED_FUNCTIONS="['_mmd_version', '_markdown_to_string']" -s OUTLINING_LIMIT=10000

$(CC):
	git submodule init
	git submodule update

dist/plaintext.js: build/libmultimarkdown.js src/*.js
	mkdir -p dist
	cat src/multimarkdown_header.js build/libmultimarkdown.js src/multimarkdown_footer.js > $@

clean:
	rm -rf build dist
	make -C $(MMDDIR) clean
