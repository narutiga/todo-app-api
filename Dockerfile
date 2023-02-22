# dev
FROM node:18-slim as dev
ENV NODE_ENV=development

WORKDIR /app

COPY package.json yarn.lock ./

RUN chown -R node:node /app

USER node

RUN yarn

# test
FROM dev as test
ENV NODE_ENV=test

RUN yarn install --frozen-lockfile

