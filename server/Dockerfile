FROM node:lts-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


EXPOSE 3001 5432

# You can change this
RUN npm install
CMD [ "npm", "start"]