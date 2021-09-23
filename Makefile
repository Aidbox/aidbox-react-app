install:
	yarn install;

prepare:
	cp -n .env.tmpl .env;
	cp -n .env ./react-app/.env;

up:
	docker-compose -f docker-compose.yml up -d devbox;
	docker-compose -f docker-compose.yml up --exit-code-from dockerize-devbox dockerize-devbox || exit 1;
	docker-compose -f docker-compose.yml up -d app;
	docker-compose -f docker-compose.yml up --exit-code-from dockerize-app dockerize-app || exit 1;
	npm run start:react-app;

down:
	docker-compose down;

build:
	npm run build;

test:
	npm run test;

generate-aidbox-ts:
	make up;
	docker-compose -f docker-compose.yml -f docker-compose.aidbox-ts.yml run --rm aidbox-ts-generator;
	yarn run prettier --write shared/src/contrib/aidbox/index.ts;

unlock-pg:
	sudo chmod a+rwx pgdata && sudo chown -R ${USER}:${USER} pgdata;

ci:
	make up;
	make generate-aidbox-ts;
	make typecheck;
	make test;
