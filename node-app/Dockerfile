FROM node:14-alpine as builder
WORKDIR /usr
COPY package.json ./
COPY tsconfig.build.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build


FROM node:14-alpine
WORKDIR /usr
COPY package.json ./
RUN npm install --only=production
COPY --from=builder /usr/build .
COPY resources ./resources
CMD ["node","index.js"]