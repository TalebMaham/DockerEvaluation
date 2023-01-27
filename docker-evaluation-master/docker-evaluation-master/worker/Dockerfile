FROM node:latest
COPY . .
RUN npm install
ENV PORT 8080
EXPOSE 8080
CMD [ "node", "main" ]
COPY run.sh .
CMD ["sh", "run.sh"]