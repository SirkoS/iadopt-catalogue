FROM node:26-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# add pnpm
COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm

# install dependencies
COPY src/pnpm-lock.yaml /home/iadopt-catalog/
COPY src/pnpm-workspace.yaml /home/iadopt-catalog/
COPY src/package.json /home/iadopt-catalog/
RUN cd /home/iadopt-catalog/ && pnpm i

# add remaining code
COPY src /home/iadopt-catalog/

# run build
RUN cd /home/iadopt-catalog/ && pnpm run prepare
ENTRYPOINT [ "/home/iadopt-catalog/entrypoint.sh" ]
