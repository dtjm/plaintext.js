BUILDDIR=build
MMDDIR=deps/multimarkdown-4
CC=deps/emscripten/emcc
CCFLAGS=-O2

ifeq (${TRAVIS},true)
	HOST_NAME="linux-ubuntu-12.04"
else
	HOST_NAME="apple-darwin11"
endif

all: dist/plaintext.js

deps/llvm:
	curl http://llvm.org/releases/3.2/clang+llvm-3.2-x86_64-$(HOST_NAME).tar.gz | tar zxf -
	mv clang+llvm-3.2-x86_64-$(HOST_NAME) deps/llvm
	ls deps/llvm
	ls -l /home/travis/dtjm/plaintext.js/deps/llvm/bin/clang++

deps/multimarkdown-4:
	git submodule update --init --recursive

$(MMDDIR)/parser.c:
	git submodule update --init --recursive
	make -C $(MMDDIR)

build/libmultimarkdown.js: deps/llvm $(MMDDIR)/parser.c
	git submodule update --init --recursive
	mkdir -p build
	$(CC) -O2 $(MMDDIR)/*.c -o $@ -s EXPORTED_FUNCTIONS="['_mmd_version', '_markdown_to_string']" -s OUTLINING_LIMIT=10000

$(CC): deps/llvm
	git submodule update --init --recursive

dist/plaintext.js: build/libmultimarkdown.js src/*.js
	mkdir -p dist
	cat src/multimarkdown_header.js build/libmultimarkdown.js src/multimarkdown_footer.js > $@

clean:
	rm -rf build dist deps
