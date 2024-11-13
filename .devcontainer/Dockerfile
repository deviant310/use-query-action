FROM node:22.11.0

RUN npm i npm@10.9.0 -g

ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV DEVCONTAINER=true

WORKDIR /usr/src/app

USER node
