FROM node:22-alpine AS builder
WORKDIR /ui
COPY frontend .
RUN npx pnpm install && npx pnpm run build

FROM alpine:latest

ARG PB_VERSION=0.22.30
COPY --from=builder /ui/build /pb/pb_public

RUN apk add --no-cache \
 unzip \
 ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_arm64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /backend/

# uncomment to copy the local pb_migrations dir into the image
#COPY backend/pb_migrations /backend/pb_migrations

# uncomment to copy the local pb_data dir into the image
#COPY backend/pb_data /backend/pb_data

# uncomment to copy the local pb_hooks dir into the image
COPY backend/pb_hooks /backend/pb_hooks

# expose PocketBase port
EXPOSE 8090

# start PocketBase
CMD ["/backend/pocketbase", "serve", "--http", "0.0.0.0:8090"]