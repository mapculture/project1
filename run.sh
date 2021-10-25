# Run script without docker-compose:
#sudo docker build -t project1_rough:latest .
#sudo docker run -it -d -p 5000:5000 --name p1_rough project1_rough

# Run script with docker-compose:
sudo docker-compose build
sudo docker-compose up -d

