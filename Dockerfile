FROM node:20 as build


WORKDIR /App
COPY ./Web/package.json ./Web/yarn.lock ./
RUN yarn install
RUN npx update-browserslist-db@latest

WORKDIR /Common
COPY ./Common/package.json ./Common/yarn.lock ./
RUN yarn install

WORKDIR /App

COPY ./Web /App
COPY ./Common /Common
ARG REACT_APP_API_BASE_URL
ARG PUBLIC_URL
RUN yarn build


FROM php:8.3-apache
ARG UID
ARG GID
RUN groupadd -g ${UID} httpd
RUN useradd httpd -m -u ${UID} -g ${GID}
RUN a2enmod rewrite

COPY --from=build /App/build /var/www/html
COPY ./Web/.htaccess /var/www/html
USER httpd
