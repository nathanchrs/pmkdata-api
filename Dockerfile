FROM node:boron-alpine

# Create app directory and set as working directory
RUN mkdir -p /usr/src/pmkdata-api
WORKDIR /usr/src/pmkdata-api

# Use default node (non-root) user
USER node

# Install app dependencies (done before copying app source to optimize caching)
COPY package.json /usr/src/pmkdata-api/

# Permission problem fix
USER root
RUN chown -R node:node /usr/src/pmkdata-api
USER node

RUN npm install --quiet

# Copy app source to container
COPY . /usr/src/pmkdata-api

# Permission problem fix
USER root
RUN chown -R node:node /usr/src/pmkdata-api
USER node

EXPOSE 3000
CMD ["npm", "start"]


