FROM node:18-alpine

# Install curl
RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

#docker run -d   --name wateval-app   --add-host=host.docker.internal:host-gateway   -v /home/shifath/wateval/next-wateavl/results:/app/results  wateval-next