FROM node:latest

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/musician/

WORKDIR /opt/musician
RUN npm install

ENTRYPOINT ["node", "/opt/musician/musician.js"]