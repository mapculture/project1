# Author:       Kaiser Slocum
# Created:      10/4/2021
# Last Edited:  10/10/2021 
# The following articles were referenced in the creation of this project
# Only the basic concepts were gleaned - any code shown in the articles was ignored
# Hence, any similarities in code is purely coincidental due to the similar nature of the projects
#https://towardsdatascience.com/evolution-of-a-salesman-a-complete-genetic-algorithm-tutorial-for-python-6fe5d2b3ca35
#https://www.geeksforgeeks.org/traveling-salesman-problem-using-genetic-algorithm/
#https://www.hindawi.com/journals/cin/2017/7430125/
#https://towardsdatascience.com/tuning-a-traveling-salesman-cadfd7d22e1c

#import random, operator, Gnome, Gnomes, time, math
import random, operator, time, math

from . import Gnome, Gnomes

# For testing purposes only: DON'T USE!
def fixedStatTester():
    matrix = [
        [0,90,48,3,94,71,9,10,46,7], 
        [90,0,29,13,25,9,80,90,20,65],
        [48,29,0,93,4,91,29,41,14,22],
        [3,13,93,0,45,8,79,38,58,2],
        [94,25,4,45,0,43,92,13,85,42],
        [71,9,91,8,43,0,47,76,46,31],
        [9,80,29,79,92,47,0,4,63,89],
        [10,90,41,38,13,76,4,0,97,94],
        [46,20,14,58,85,46,63,97,0,42],
        [7,65,22,2,42,31,89,94,42,0]]

    numCells = 10
    numPop = 100
    numElites = 10
    numTrials = 30

    genSum = 0
    timeSum = 0
    for x in range(0,numTrials):
        tic = time.perf_counter()
        generation = 0
        gnomes = Gnomes.Gnomes(numPop,numCells,numElites, 0.2,matrix,matrix)
        gnomes.selectionSortByDistance()
        print("Best:", gnomes[0].distance) 
        #print("Worst:", gnomes[numPop-1].distance)
        while (gnomes.bestDistanceRoute.distance > 90):
            gnomes.createNewDisPop()
            gnomes.selectionSortByDistance()
            print("Best:", gnomes[0].distance) 
            #print("Worst:", gnomes[numPop-1].distance)
            generation = generation + 1
        toc = time.perf_counter()
        genSum = genSum + generation
        timeSum = timeSum + toc - tic
        print("")

    print("Total Time:", timeSum/numTrials, "sec")
    print("Number of Generations:",genSum/numTrials,"generations")
# For testing purposes only: DON'T USE!
def randomStatTester():
    numCells = 10
    numPop = 100
    numElites = 1
    matrix = [[0 for x in range(numCells)] for y in range(numCells)] 
    for i in range(0,numCells):
       for j in range(i+1, numCells):
           matrix[i][j] = random.randint(0,100)
           matrix[j][i] = matrix[i][j]

    for i in range(0, numCells):
        print("[", end="")
        for j in range(0, numCells):
            print(matrix[i][j], ",", end="")
        print("]")
    
    gnomes = Gnomes.Gnomes(numPop,numCells,numElites,0.1,matrix,matrix)
    gnomes.selectionSortByDistance()
    print("Best:", gnomes[0].distance) 
    print("Worst:", gnomes[numPop-1].distance)
    t = time.perf_counter()
    while (t < 30):
        gnomes.createNewDisPop()
        gnomes.selectionSortByDistance()
        print("Best:", gnomes[0].distance) 
        print("Worst:", gnomes[numPop-1].distance)
        t = time.perf_counter()

# Use this to get the best distance route
# This method returns a Python array of the best route
def getBestDistanceRoute(numCity, distanceMatrix, timeSec):
    if (len(distanceMatrix) != numCity):
        raise Exception("The size of the distanceMatrix does not match the number of cities!")
    if (numCity <= 1):
        raise Exception("You must have at least two cities!")
    if (numCity > 30):
        raise Exception("Too many cities provided!")

    if(numCity < 5):
        numPop = math.factorial(numCity)
    else:
        numPop = 10 * numCity
    numCells = numCity
    numElites = 1
    mutationRate = 0.1
    
    gnomes = Gnomes.Gnomes(numPop,numCells,numElites,mutationRate,None,distanceMatrix)
    t = time.perf_counter()
    while (t < timeSec):
        gnomes.createNewDisPop()
        t = time.perf_counter()

    return gnomes.bestDistanceRoute.getGnome()

# Use this to get the best duration route
# This method returns a Python array of the best route
def getBestDurationRoute(numCity, durationMatrix, timeSec):
    if (len(durationMatrix) != numCity):
        raise Exception("The size of the durationMatrix does not match the number of cities!")
    if (numCity <= 1):
        raise Exception("You must have at least two cities!")
    if (numCity > 30):
        raise Exception("Too many cities provided!")

    if(numCity < 5):
        numPop = math.factorial(numCity)
    else:
        numPop = 10 * numCity
    numCells = numCity
    numElites = 1
    mutationRate = 0.1
    
    gnomes = Gnomes.Gnomes(numPop,numCells,numElites,mutationRate,durationMatrix, None)
    t = time.perf_counter()
    while (t < timeSec):
        gnomes.createNewDisPop()
        t = time.perf_counter()

    return gnomes.bestDistanceRoute.getGnome()
