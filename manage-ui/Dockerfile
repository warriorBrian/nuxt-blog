FROM node:14.16.1-alpine as builder

COPY modules /opt/builder

WORKDIR /opt/builder/

RUN yarn \
    && yarn build

FROM nginx:1.19.0-alpine

COPY ./default.conf /etc/nginx/conf.d/

COPY --from=builder /opt/builder/dist/ /opt/default/dist/

CMD ["nginx", "-g", "daemon off;"]
