FROM node:carbon-alpine

# Create app directory and set as working directory
RUN mkdir -p /opt/pmkdata-api
WORKDIR /opt/pmkdata-api

# Install app dependencies (done before copying app source to optimize caching)
COPY package.json /opt/pmkdata-api/
RUN npm install --quiet

# Copy app source to container
COPY . /opt/pmkdata-api

# Use default node (non-root) user
RUN chown -R node:node /opt/pmkdata-api
USER node

EXPOSE 3000
CMD ["npm", "start"]
