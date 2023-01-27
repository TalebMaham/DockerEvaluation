FROM node:latest
COPY . .
RUN npm install
ENV TASKS 4
ENV PORT 3000
EXPOSE 3000
CMD [ "node", "main" ]