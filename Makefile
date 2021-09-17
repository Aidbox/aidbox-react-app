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
