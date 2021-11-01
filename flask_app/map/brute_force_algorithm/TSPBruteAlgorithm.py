import random, time, math

numCity = 1
bestPath = [0]
currPath = [0]
distance = 1
matrix = [[0][0]]

def rotate(i1, i2):
    last = i2
    rang = i2-i1
    two = currPath[i2]
    for x in range(0, rang):
        one = currPath[i2-1]
        currPath[i2-1] = two
        i2 = i2-1
        two = one
    currPath[last] = two

def stuff(sIndex, timeSec):
    global distance
    if (time.perf_counter() > timeSec):
        return
    if (sIndex == 0):
        stuff(1,timeSec)
    elif (sIndex == numCity-1):
        sum = 0
        for x in range(0, numCity):
             sum = sum + matrix[currPath[x]][currPath[x+1]]
        if (sum < distance):
            distance = sum
            for x in range(0, numCity):
                bestPath[x] = currPath[x]
    else:
        for x in range(sIndex, numCity):
            stuff(sIndex+1,timeSec) 
            rotate(sIndex, numCity-1)
    return

def getBestRoute(numCities, theMatrix, timeSec):
    global numCity
    global bestPath
    global currPath
    global distance
    global matrix

    matrix = theMatrix
    numCity = numCities
    bestPath = [x for x in range(0,numCity+1)]
    bestPath[numCity] = 0
    currPath = [x for x in range(0,numCity+1)]
    currPath[numCity] = 0
    distance = math.inf    
    stuff(0,timeSec)
    return bestPath
