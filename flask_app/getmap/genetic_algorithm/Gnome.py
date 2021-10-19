# Author:       Kaiser Slocum
# Created:      10/4/2021
# Last Edited:  10/18/2021 
import random

class Gnome(object):
    """
    Gnome class: 
    Represents a Gnome with cells
    The first cell and last cell represent starting and ending at the same city (0) and may not be changed
    """
    # Constructor, can be supplied duration and distance matrices
    # NOTE: numCells is the number of unique cells, not the length of the gnome
    def __init__(self, numCells = 1, durationMatrix = None, distanceMatrix = None):
        # We always must have at least 1 unique cell since we must leave from and return to the same city
        if (numCells < 1):
            raise Exception
        # The following variables should never be modified    
        self.numCells = numCells             
        self.__gnome = [0] * (numCells-1) 
        self.__durationMatrix = durationMatrix
        self.__distanceMatrix = distanceMatrix
        # The following are public
        self.duration = 0  
        self.distance = 0
        # We will fill the gnome with random values from 0 (starting place) to (numCells)        
        for x in range(0, self.numCells-1):
            self.__gnome[x] = x+1        
        random.shuffle(self.__gnome)
        self.__gnome.append(0)
        self.__gnome.insert(0,0)
        # The distance and duration are updated before the method ends
        self.calcDur()
        self.calcDis()

    # Calculates the total duration for the Gnome, if there is no duration matrix, nothing is done
    def calcDur(self): 
        self.duration = 0
        if (self.__durationMatrix != None):
            for x in range(0, self.numCells):
                self.duration = self.duration + self.__durationMatrix[self.__gnome[x]][self.__gnome[x+1]]
    # Calculates the total distance for the Gnome, if there is no distance matrix, nothing is done
    def calcDis(self):      
        self.distance = 0
        if (self.__distanceMatrix != None):
            for x in range(0, self.numCells):
                self.distance = self.distance + self.__distanceMatrix[self.__gnome[x]][self.__gnome[x+1]]   
    # Randomly swaps two cells
    def mutate(self):
        # If we have only one city, don't bother mutating
        if (self.numCells < 3):
            return
        # We must pick two random cells to swap
        randNum1 = random.randint(1,self.numCells-2)
        randNum2 = random.randint(randNum1+1, self.numCells-1)
        # Swap the cells
        temp = self.__gnome[randNum1]
        self.__gnome[randNum1] = self.__gnome[randNum2]
        self.__gnome[randNum2] = temp
        # Calculate the new distance/duration
        self.calcDis()
        self.calcDur()
    # I overload the index operators because we want to access each cell in the list of cells straightaway
    # Overloaded Operator: Returns cell at specified index
    def __getitem__(self, index):
        if ((index < 0) or (index > self.numCells)):
            raise Exception
        return self.__gnome[index]
    # Overloaded Operator: Changes cell contents to "value" at specified index
    def __setitem__(self, index, value):
        if ((index <= 0) or (index >= self.numCells)):
            raise Exception
        self.__gnome[index] = value
        # if we ever change a cell, we need to recalculate the duration and distance so our duration/distance is always correct
        self.calcDis()
        self.calcDur()
    # Returns a reference to the list of cells
    def getGnome(self):
        return self.__gnome    
    # Prints entire Gnome to console
    def printGnome(self):
        print("Gnome: ", self.__gnome, "Dis: ", self.distance, "Dur: ", self.duration)  
