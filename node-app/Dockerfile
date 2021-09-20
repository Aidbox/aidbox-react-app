FROM node:14-alpine as builder
WORKDIR /app
COPY package.json ./
COPY tsconfig.build.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build


FROM node:14-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=builder /usr/build .
COPY resources ./resources
CMD ["node","index.js"]
