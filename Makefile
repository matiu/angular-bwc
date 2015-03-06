BIN_PATH:=node_modules/.bin/

all:	angular-bwc.min.js

clean:
	rm angular-bwc.js
	rm angular-bwc.min.js

bitcore-wallet-client.js: index.js
	${BIN_PATH}browserify $< > $@


bitcore-wallet-client.min.js: angular-bwc.js
	${BIN_PATH}uglify  -s $<  -o $@
