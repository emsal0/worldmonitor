FROM ubuntu:jammy
RUN apt-get update --fix-missing
RUN apt-get -y install pkg-config build-essential curl \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        wget \
        && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash &&\
    apt-get install -y nodejs

RUN npm install -g npm@9.1.1
RUN npm install -g @angular/cli

RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH "/root/.cargo/bin:${PATH}"
RUN rustup toolchain install nightly

# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash \
#     && . ~/.nvm/nvm.sh \
#     && nvm install v16.16.0 \
#     && nvm alias default v16.16.0 \
#     && nvm use default


# ENV NODE_PATH ~/.nvm/v16.16.0/lib/node_modules
# ENV PATH      ~/.nvm/v16.16.0/bin:$PATH

COPY . /worldmonitor

WORKDIR /worldmonitor/js
RUN npm install --force

WORKDIR /worldmonitor
ENV CARGO_NET_GIT_FETCH_WITH_CLI true
ENV RUST_BACKTRACE full
RUN cargo build
EXPOSE 8080
# RUN cargo +nightly build -Z no-index-update
CMD ["cargo", "run"]
