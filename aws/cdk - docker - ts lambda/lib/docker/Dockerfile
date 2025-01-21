FROM public.ecr.aws/lambda/nodejs
WORKDIR /var/task
COPY package.json tsconfig.json app.ts ./
RUN npm install
RUN npm run build
CMD ["dist/app.handler"]