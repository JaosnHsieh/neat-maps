FROM node:8.12.0 
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install -y vim
COPY . .
RUN yarn
RUN yarn build
CMD ["node ","index.js"]