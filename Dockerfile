# https://milanwittpohl.com/projects/tutorials/Full-Stack-Web-App/


FROM node:15.11.0-alpine3.12 as frontend

WORKDIR /src

ADD frontend ./
RUN yarn install && yarn build

ENTRYPOINT ["npx", "nuxt", "start"]
EXPOSE 3000