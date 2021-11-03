##################################################################################
# File name: Dockerfile
#
# Author: Kelemen Szimonisz
# Organization: Map Culture (University of Oregon, CIS422, FALL 2021) 
#
# This Dockerfile is used to configure how Docker builds our Docker image.
# Docker is used to standardize the development process by containerizing our web app.
# The operating system, frameworks, libraries, and dependencies used by the web app are defined
#
# Helpful resources:
#       https://goinbigdata.com/docker-run-vs-cmd-vs-entrypoint/
#       https://docker-curriculum.com/
#
# Creation Date: 10/01/2021
# Last Edited: 11/02/2021
##################################################################################

# Specify debian Linux as our base image (parent image)
FROM debian
LABEL maintainer="kelemens@uoregon.edu"
LABEL build_date="2021-11-2"

# update Debian's apt-get packages list
RUN apt-get update -y

# install pip, python, and some essential Debian building packages
RUN apt-get install -y python3-pip python-dev build-essential
# Copy all files from Dockerfile's current directory to the folder /app inside the image
COPY . /app
# Set /app as the working directory for the RUN, CMD commands
WORKDIR /app

# Set environmental variables (inside the Docker image) for the flask app 
# flask_app folder contains the main Flask app package
ENV FLASK_APP=flask_app
# the host the app will bind to (0.0.0.0)
ENV FLASK_RUN_HOST=0.0.0.0
# server will reload itself on file changes if in development mode
ENV FLASK_ENV=development

# Run a shell command on top of the current image
# Install all python dependencies found in the requirements.txt file using pip
# Creates a new layer by committing the results
RUN pip3 install -r requirements.txt
# The default command that will be executed when you run the docker container
# (Run flask)
CMD ["flask","run"]
