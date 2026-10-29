FROM node:26-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# add pnpm
COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm

# install dependencies
COPY src/pnpm-lock.yaml /home/iadopt-catalogue/
COPY src/pnpm-workspace.yaml /home/iadopt-catalogue/
COPY src/package.json /home/iadopt-catalogue/
RUN cd /home/iadopt-catalogue/ && pnpm i

# add remaining code
COPY src /home/iadopt-catalogue/

# run build
RUN cd /home/iadopt-catalogue/ && pnpm run prepare
ENTRYPOINT [ "/home/iadopt-catalogue/entrypoint.sh" ]
