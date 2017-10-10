FROM node:alpine
MAINTAINER Troven <cto@troven.com.au>

COPY package.json package.json  
RUN npm install
RUN npm install --global bower

COPY bower.json bower.json  
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN bower install --allow-root

# Add your source files
COPY js js
COPY demo demo

# Launch NodeJS
CMD ["npm","run boot"]  

EXPOSE 3002
