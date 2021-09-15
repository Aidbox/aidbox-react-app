install:
	cd node-app && npm install;
	cd react-app && npm install;
prepare:
	cp -n .env.tmpl react-app/.env;
	cp -n .env.tmpl .env;
up:
	docker-compose up -d;
	cd node-app && npm run dev;

build:
	cd react-app && npm run build;
