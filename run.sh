##################################################################################
# File name: run.sh
#
# Author: Kelemen Szimonisz
# Organization: Map Culture (University of Oregon, CIS422, FALL 2021) 
#
# This very simple bash script allows the user to easily utilize docker-compose.yml to:
# Build the Docker image (from the Dockerfile)
# Run the image in a container
# Run each container as a service
#
# Creation Date: 10/01/2021
# Last Edited: 10/24/2021
##################################################################################
# The old run script (without docker-compose):
#sudo docker build -t project1_rough:latest .
#sudo docker run -it -d -p 5000:5000 --name p1_rough project1_rough

# build the service
sudo docker-compose build
# run the service (-d means the process will be detached from the terminal)
sudo docker-compose up -d

