FROM node:latest

WORKDIR /usr/src/www

COPY . .

RUN npm install


EXPOSE 5280

CMD npm run start