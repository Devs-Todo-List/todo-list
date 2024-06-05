FROM node:16

# ENV VITE_API_URL="http://localhost:5215"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "start"]