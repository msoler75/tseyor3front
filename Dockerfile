FROM node:12

WORKDIR /usr/src/app

<<<<<<< HEAD
COPY package*.json ./
RUN npm install
# RUN npm ci --only=production 
COPY . .


EXPOSE 8080

ENV HOST 0.0.0.0
ENV PORT 8080
ENV NODE_ENV production
=======
COPY . ./
RUN npm install

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080
>>>>>>> 5b926bc2a1de7e3a306baf12ce3b4a592763b686

RUN npm run build

#start the service
CMD [ "npm", "run", "start" ]