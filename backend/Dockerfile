FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

ENV PORT=5000
ENV MONGO_URI=mongodb://admin:secret@url-shortener-mongodb:27017/url-shortener?authSource=admin
ENV JWT_SECRET=U@JrGJ^VG\/E66dF
ENV BASE_URL=http://localhost:5000

EXPOSE 5000

CMD ["yarn", "dev"]
