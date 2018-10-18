FROM node:10.12.0-alpine

ENV NPM_CONFIG_LOGLEVEL warn
COPY . . 
RUN npm install && npm run build --production && npm audit fix -f
RUN npm install -g serve
CMD serve -s build
EXPOSE 5000
