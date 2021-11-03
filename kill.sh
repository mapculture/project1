##################################################################################
# File name: kill.sh
#
# Author: Kelemen Szimonisz
# Organization: Map Culture (University of Oregon, CIS422, FALL 2021) 
#
# This very simple bash script allows the user to easily utilize docker-compose to:
# Stop and remove all containers, images, volumes created by docker-compose up
#
# Creation Date: 10/01/2021
# Last Edited: 10/07/2021
##################################################################################

# Kill container (without docker compose)
#sudo docker kill p1_rough
#sudo docker rm p1_rough

# Stop container (with docker compose)
sudo docker-compose down
