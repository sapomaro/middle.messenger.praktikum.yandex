FROM ubuntu:22.04
RUN apt update && apt install -y nodejs && apt install -y npm
WORKDIR /var/www/
EXPOSE 3000
RUN git clone -b deploy --single-branch https://github.com/sapomaro/middle.messenger.praktikum.yandex.git /var/www/
RUN cd /var/www/
RUN npm install
CMD npm run start
