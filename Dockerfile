FROM node:10-slim

COPY . /home/node/app

WORKDIR /home/node/app

RUN apt update -y && \
    apt install ffmpeg -y && \
    npm i

EXPOSE 1337

CMD [ "npm", "start" ]