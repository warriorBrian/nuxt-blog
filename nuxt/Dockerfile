FROM node:14.16.1-alpine

COPY modules /opt/builder

WORKDIR /opt/builder/

RUN yarn \
    && yarn build

CMD ["npm", "run", "start"]
