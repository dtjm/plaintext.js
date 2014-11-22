FROM hanazuki/ubuntu-emscripten

RUN ["sh", "-c", "apt-get update && apt-get install curl -y && curl -sL https://deb.nodesource.com/setup | sudo bash - && apt-get install -y nodejs"]