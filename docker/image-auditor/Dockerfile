FROM node:latest

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/auditor/

WORKDIR /opt/auditor/
RUN npm install

ENTRYPOINT ["node", "/opt/auditor/auditor.js"]