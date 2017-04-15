bootstrap: clean
	yarn

clean:
	rm -rf node_modules
	rm -rf dist

lint:
	npm run lint

start:
	npm run server-prod

dev:
	./node_modules/.bin/webpack -d &&./node_modules/.bin/webpack-dev-server --content-base dist/

build:
	./node_modules/.bin/webpack -p
