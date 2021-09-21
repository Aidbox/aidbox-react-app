install:
	cd node-app && npm ci;
	cd react-app && npm ci;
prepare:
	cp -n .env.tmpl react-app/.env;
	cp -n .env.tmpl .env;
up:
	docker-compose up -d;
	cd node-app && npm run dev;

build:
	cd react-app && npm run build;

prepare-test:
	docker-compose -f docker-compose.tests.yml up -d devbox;
	docker-compose -f docker-compose.tests.yml up --exit-code-from dockerize-devbox dockerize-devbox || exit 1;
	docker-compose -f docker-compose.tests.yml up -d app;
	docker-compose -f docker-compose.tests.yml up --exit-code-from dockerize-app dockerize-app || exit 1;

test:
	cd node-app && npm run test;

ci:
	make prepare-test;
	make test;