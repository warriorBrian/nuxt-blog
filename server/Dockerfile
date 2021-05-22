FROM node:14.16.1-alpine

COPY modules /opt/server

COPY start /usr/local/bin/

COPY wait-for.sh /usr/local/bin/

WORKDIR /opt/server

RUN yarn \
    && yarn build \
    && yarn global add typeorm@0.2.30 \
    && chmod +x /usr/local/bin/start \
    && chmod +x /usr/local/bin/wait-for.sh

ENTRYPOINT ["start"]

CMD ["node", "dist/src/main.js"]
