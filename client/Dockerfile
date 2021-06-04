FROM node:lts-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .


EXPOSE 3000

# attempting with port 3000
RUN npm install react-bootstrap
CMD [ "npm", "start" ]



# attempting with BUILD
# RUN npm install react-bootstrap
# RUN npm install
# CMD [ "npm", "run", "build" ]



#  docker build -t frontend .
#  docker run -dp 3000:3000 frontend