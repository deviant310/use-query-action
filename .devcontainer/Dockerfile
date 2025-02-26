FROM node:22

RUN npm i npm@11 -g

ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV DEVCONTAINER=true

WORKDIR /usr/src/app

USER node
