
FROM node:alpine

# Установка необходимых пакетов для сборки и отладки
RUN apk add --no-cache build-base git autoconf automake libtool linux-headers coreutils libc-dev

# Клонирование и установка wolfSSL
RUN git clone https://github.com/wolfSSL/wolfssl.git     && cd wolfssl     && ./autogen.sh     && ./configure     && make     && make install

# Создание символической ссылки для libwolfssl.so.32
RUN ln -s /usr/local/lib/libwolfssl.so /usr/local/lib/libwolfssl.so.32

# Создание директории, если она не существует
RUN mkdir -p /etc/ld.so.conf.d

# Запись пути установки библиотеки в конфигурацию ldconfig (если требуется)
RUN echo "/usr/local/lib" > /etc/ld.so.conf.d/local.conf && ldconfig || echo "ldconfig not available, skipping"

# Диагностика для проверки установки и видимости libwolfssl
RUN ls -lah /usr/local/lib | grep libwolfssl
RUN ldconfig -p | grep wolfssl || echo "ldconfig not available, showing /usr/local/lib contents" && ls /usr/local/lib

ENV LD_LIBRARY_PATH=/usr/local/lib

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3001

CMD [ "node", "server.js" ]

#auth-microserv