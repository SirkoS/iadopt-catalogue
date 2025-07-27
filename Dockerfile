FROM node:24-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# environment
ENV SOURCE_PATH="/github/workspace"
ENV TARGET_PATH="/github/workspace/build"

# install dependencies
COPY src/pnpm-lock.yaml /home/iadopt-catalog/
COPY src/package.json /home/iadopt-catalog/
RUN cd /home/iadopt-catalog/ && pnpm i

# add remaining code
COPY src /home/iadopt-catalog/

# run build
RUN cd /home/iadopt-catalog/ && pnpm run prepare
ENTRYPOINT [ "/home/iadopt-catalog/entrypoint.sh" ]
