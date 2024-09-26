# Vi väljer Node version 20 (minor versions spelar ingen roll)
FROM node:20-alpine

# Vår app läggs i /app
WORKDIR /app

# Vi kopierar package-lock och package.json till vårt workspace.
COPY package*.json ./

# Efter kopieringen installerar vi alla paket (express)
RUN npm install

# Vi kopierar resterande filer (ex. app.js) EJ node_modules då vi ignorerat den.
COPY . .

# Vi säger åt containern att öppna sig för requests på port 3000.
EXPOSE 3000

# Till sist så kör vi igång servern.
CMD ["node", "app.js"]