# Dockerfile pour TokenChain Node
FROM rust:1.76 as builder
WORKDIR /usr/src/tokenchain-node
COPY . .
RUN cargo build --release

FROM debian:buster-slim
WORKDIR /app
COPY --from=builder /usr/src/tokenchain-node/target/release/tokenchain-node ./tokenchain-node
EXPOSE 9944 9933 30333
CMD ["./tokenchain-node", "--dev"]
