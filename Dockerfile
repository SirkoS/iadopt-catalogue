FROM node:24-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# environment
ENV SOURCE_PATH="/github/workspace"
ENV TARGET_PATH="/github/workspace/build"
WORKDIR /home/iadopt-catalog

# install dependencies
COPY src/pnpm-lock.yaml .
COPY src/package.json .
RUN pnpm i

# add remaining code
COPY src .

# run build
RUN pnpm run prepare
ENTRYPOINT [ "pnpm", "run", "build" ]
