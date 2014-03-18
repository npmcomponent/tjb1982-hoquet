
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

hoquet.js: components
	@component build --standalone hoquet --out . --name hoquet

hoquet.min.js: hoquet.js
	@uglifyjs $< > $@

hoquet.min.js.gz: hoquet.min.js
	@zopfli -c $< > $@

all: clean build hoquet.min.js.gz

.PHONY: clean all
