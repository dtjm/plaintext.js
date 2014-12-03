BUILDDIR=build
MMDDIR=deps/multimarkdown-4

all: dist/plaintext.js spec
	
deps/multimarkdown-4:
	git submodule update --init --recursive

$(MMDDIR)/parser.o:
	git submodule update --init --recursive
	fig run build make -C $(MMDDIR)

build/plaintext.js: src/*.ts 
	tsc --outDir ./build --module amd src/plaintext.ts

build/libmultimarkdown.js: $(MMDDIR)/parser.o
	git submodule update --init --recursive
	mkdir -pv build
	fig run build bash -c "emcc -O2 /src/$(MMDDIR)/*.c -o $@ -s EXPORTED_FUNCTIONS=\"['_mmd_version', '_markdown_to_string']\" -s OUTLINING_LIMIT=10000"

build/textile.js: node_modules/textile-js
	mkdir -pv build
	cp -v node_modules/textile-js/lib/textile.js build/

node_modules/textile-js:
	npm install

dist/plaintext.js: build/libmultimarkdown.js build/textile.js build/plaintext.js
	mkdir -pv dist
	cat build/textile.js build/libmultimarkdown.js build/plaintext.js | \
		grep -v process.platform.match > $@

test: dist/plaintext.js spec
	./node_modules/karma/bin/karma start karma.conf.js --single-run

autotest:  dist/plaintext.js spec
	./node_modules/karma/bin/karma start karma.conf.js

spec: tests/jasmine/spec/plaintext_spec.js

tests/jasmine/spec/%.js: tests/jasmine/spec_src/%.ts
	mkdir -pv tests/jasmine/spec
	tsc --outDir tests/jasmine/spec $<

clean:
	rm -rf build dist deps
