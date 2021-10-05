FROM debian
LABEL maintainer="developers@mapculture.co"
LABEL build_date="2021-10-5"
RUN apt-get update -y
RUN apt-get install -y python3-pip python-dev build-essential
COPY . /app
WORKDIR /app
ENV FLASK_APP=flask_app
ENV FLASK_RUN_HOST=0.0.0.0

# server will reload itself on file changes if in development mode
ENV FLASK_ENV=development
RUN pip3 install -r requirements.txt
CMD ["flask","run"]
