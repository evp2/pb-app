FROM alpine:latest

ARG PB_VERSION=0.22.30
COPY /sk/build /pb/pb_public

RUN apk add --no-cache \
 unzip \
 ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_arm64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# uncomment to copy the local pb_migrations dir into the image
#COPY pb/pb_migrations /pb/pb_migrations

#TODO: setup db with test data
COPY pb/pb_data /pb/pb_data

# uncomment to copy the local pb_hooks dir into the image
COPY pb/pb_hooks /pb/pb_hooks

# expose PocketBase port
EXPOSE 8090

# start PocketBase in dev mode
CMD ["/pb/pocketbase", "--dev",  "serve", "--http", "0.0.0.0:8090"]