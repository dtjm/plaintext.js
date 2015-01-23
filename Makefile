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
	# Set total memory to 256MB because large markdown documents will run into the default 16MB limit
	fig run build bash -c "emcc -O2 /src/$(MMDDIR)/*.c -o $@ -s EXPORTED_FUNCTIONS=\"['_mmd_version', '_markdown_to_string']\" -s OUTLINING_LIMIT=10000 -s TOTAL_MEMORY=268435456"

build/textile.js: node_modules/textile-js
	mkdir -pv build
	cp -v node_modules/textile-js/lib/textile.js build/

node_modules/textile-js:
	npm install

dist/plaintext.js: src/*.js src/**/*.js build/textile.js build/libmultimarkdown.js
	mkdir -pv dist
	cat src/header.js \
		src/typed_array_shim.js \
		src/Fountain.js/fountain.js \
		build/textile.js \
		build/libmultimarkdown.js \
		src/plaintext.js \
		src/footer.js \
		| grep -v process.platform.match \
		| sed -e 's/\.delete/["delete"]/g' > $@

test: saucetest nodetest

nodetest:
	node ./tests/node/require_test.js

browsertest: dist/plaintext.js
	./node_modules/karma/bin/karma start tests/karma/local.conf.js --single-run

autotest:  dist/plaintext.js
	./node_modules/karma/bin/karma start tests/karma/local.conf.js

saucetest:  dist/plaintext.js test-main.js chrometest
	LAUNCHER=sl_safari ./node_modules/karma/bin/karma start tests/karma/sauce.conf.js
	LAUNCHER=sl_firefox ./node_modules/karma/bin/karma start tests/karma/sauce.conf.js
	LAUNCHER=sl_ie_11 ./node_modules/karma/bin/karma start tests/karma/sauce.conf.js
	LAUNCHER=sl_ie_10 ./node_modules/karma/bin/karma start tests/karma/sauce.conf.js
	# LAUNCHER=sl_ie_8 ./node_modules/karma/bin/karma start tests/karma/sauce.conf.js

chrometest:
	LAUNCHER=sl_chrome ./node_modules/karma/bin/karma start tests/karma/sauce.conf.js
	
ie9test:
	# LAUNCHER=sl_ie_9 ./node_modules/karma/bin/karma start tests/karma/sauce.conf.js

clean:
	rm -rf build dist deps node_modules
