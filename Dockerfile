FROM ubuntu:14.04
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get update
RUN apt-get install -y build-essential nodejs
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
