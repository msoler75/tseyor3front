FROM node:12

WORKDIR /usr/src/app

COPY . ./
RUN npm install

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080
ENV MAPS_API_KEY=${_MAPS_API_KEY}

RUN npm run build

#start the service
CMD [ "npm", "run", "start" ]