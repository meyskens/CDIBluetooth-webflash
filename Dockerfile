FROM --platform=$BUILDPLATFORM node:16 as frontend

COPY ./ /cdibluetooth-webflash

WORKDIR /cdibluetooth-webflash

RUN npm install
RUN REACT_APP_API_URL=${REACT_APP_API_URL} npm run build

FROM nginx:1.23.0-alpine

RUN mkdir -p /var/www/cdibluetooth-webflash
WORKDIR /var/www/cdibluetooth-webflash

COPY --from=frontend  /cdibluetooth-webflash /var/www/cdibluetooth-webflash
COPY nginx.conf /etc/nginx/conf.d/default.conf