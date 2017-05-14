FROM ubuntu:16.04

MAINTAINER Sigurthor Bjorgvinsson

RUN apt update && apt upgrade -y
RUN apt install python-software-properties curl make -y
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt install nodejs -y


COPY . /var/customer-keep-up/

RUN cd /var/customer-keep-up && npm i && make build

EXPOSE 1337

ENTRYPOINT ["node", "server"]