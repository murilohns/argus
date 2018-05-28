FROM node:carbon
MAINTAINER Vagner S
COPY . /home/node/app
WORKDIR /home/node/app
ENV PORT 8070
RUN npm install
ENTRYPOINT npm start
EXPOSE ${PORT}
