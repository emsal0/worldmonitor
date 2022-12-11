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

COPY . /worldmonitor

WORKDIR /worldmonitor/js
RUN npm install

WORKDIR /worldmonitor
ENV CARGO_NET_GIT_FETCH_WITH_CLI true
ENV RUST_BACKTRACE full
RUN rustup default stable
RUN cargo install --path=.
CMD ./worldmonitor $PORT
