FROM node:14
COPY . .
ENV TASKS 20
RUN yarn install
EXPOSE 3000
CMD [ "node", "main" ]