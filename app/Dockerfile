FROM strapi/base

WORKDIR /srv/app

COPY package.json .
COPY yarn.lock .

RUN npm install pm2 -g

RUN yarn install

COPY . .

ENV NODE_ENV production

RUN yarn build

EXPOSE 1337

RUN ls -l .

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
