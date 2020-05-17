FROM node:10-slim

COPY . /home/node/app

WORKDIR /home/node/app

RUN npm i

EXPOSE 1337

CMD [ "npm", "start" ]