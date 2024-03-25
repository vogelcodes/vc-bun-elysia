FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY public public
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
ENV TZ America/Sao_Paulo
CMD ["bun", "src/index.tsx"]

EXPOSE 3000