FROM node:carbon-alpine

# Create app directory and set as working directory
RUN mkdir -p /opt/pmkdata-api
WORKDIR /opt/pmkdata-api

# Use default node (non-root) user
RUN chown node:node /opt/pmkdata-api
USER node

# Install app dependencies (done before copying app source to optimize caching)
COPY --chown=node:node package.json /opt/pmkdata-api/
RUN npm install --quiet

# Copy app source to container
COPY --chown=node:node . /opt/pmkdata-api

EXPOSE 3000
CMD ["npm", "start"]
