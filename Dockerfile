# base
FROM node:18-bullseye as base

WORKDIR /app

COPY package.json yarn.lock ./

RUN chown -R node:node /app

USER node
 
# dev
FROM base as dev
ENV NODE_ENV=development

RUN yarn

# test
FROM base as test
ENV NODE_ENV=test

RUN yarn

COPY --chown=node jest.config.ts tsconfig.json ./

# build
FROM test as build

COPY --chown=node . .

RUN yarn build

# prod
FROM base as prod
ENV NODE_ENV=production

COPY --from=build app/dist app/prisma ./

RUN yarn install --frozen-lockfile --production \
  && yarn cache clean

EXPOSE 8080

# ENTRYPOINT [ "/node/bin/tini","--" ]
CMD [ "node","index.js" ]


