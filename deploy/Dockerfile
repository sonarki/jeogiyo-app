# AI Price Table — standalone container. Independent of everything else on the VPS.
FROM node:22-alpine
WORKDIR /app
COPY data/ data/
COPY assets/ assets/
COPY scripts/ scripts/
COPY deploy/server.mjs deploy/server.mjs
# Build the static site inside the image so the container is self-sufficient.
RUN node scripts/build.mjs
ENV PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=5s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
CMD ["node", "deploy/server.mjs"]
