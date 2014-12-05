BUILDDIR=build
MMDDIR=deps/multimarkdown-4

all: dist/plaintext.js
	
deps/multimarkdown-4:
	git submodule update --init --recursive

$(MMDDIR)/parser.o:
	git submodule update --init --recursive
	fig run build make -C $(MMDDIR)

build/libmultimarkdown.js: $(MMDDIR)/parser.o
	git submodule update --init --recursive
	mkdir -pv build
	fig run build bash -c "emcc -O2 /src/$(MMDDIR)/*.c -o $@ -s EXPORTED_FUNCTIONS=\"['_mmd_version', '_markdown_to_string']\" -s OUTLINING_LIMIT=10000"

build/textile.js: node_modules/textile-js
	mkdir -pv build
	cp -v node_modules/textile-js/lib/textile.js build/

node_modules/textile-js:
	npm install

dist/plaintext.js: build/libmultimarkdown.js build/textile.js src/plaintext.js
	mkdir -pv dist
	cat build/textile.js build/libmultimarkdown.js src/plaintext.js | \
		grep -v process.platform.match > $@

test: browsertest nodetest

nodetest:
	node ./tests/node/require_test.js

browsertest: dist/plaintext.js
	./node_modules/karma/bin/karma start karma.conf.js --single-run

autotest:  dist/plaintext.js
	./node_modules/karma/bin/karma start karma.conf.js

clean:
	rm -rf build dist deps
