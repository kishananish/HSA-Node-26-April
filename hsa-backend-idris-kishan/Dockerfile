# Use an official node runtime as a parent image
FROM node:8.9-alpine
# ENV NODE_ENV production
# Set the working directory to usr/src/app [set as the: working directory inside the docker container]
WORKDIR /usr/app

# COPY ["package.json", "package-lock.json*"]
COPY ["package.json", "package-lock.json*"] .
# RUN npm install --production --silent && mv node_modules ../
RUN npm install --quiet
COPY . .
EXPOSE 3000
CMD npm run start