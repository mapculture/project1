# Author:       Kaiser Slocum
# Created:      10/4/2021
# Last Edited:  10/10/2021 
import Gnome, random

class Gnomes(object):
    """
    Gnomes class: 
    Represents a specified collection of Gnomes
    This class is constructed for solving TSP using a genetic algorithm  
    """
    # Constructor
    # NOTE: numCells is the number of unique cells, not the length of the gnome
    def __init__(self, numGnomes=1, numCells=1, numElites=1,mutationRate=0.1, durationMatrix = None, distanceMatrix = None):
        if (numCells < 1):
            raise Exception("Too few number of cells!")
        if ((durationMatrix != None) and ((numCells != len(durationMatrix)) or (numCells != len(durationMatrix[0])))):
            raise Exception("Nume of cells in durationMatrix does not match numCells Arg!")  
        if ((distanceMatrix != None) and ((numCells != len(distanceMatrix)) or (numCells != len(distanceMatrix[0])))):
            raise Exception("Nume of cells in distanceMatrix does not match numCells Arg!")  
        
        self.mutationRate = mutationRate
        self.numGnomes = numGnomes
        self.numElites = numElites
        self.numCells = numCells
        self.durationMatrix = durationMatrix
        self.distanceMatrix = distanceMatrix
        self.averageDuration = 0
        self.averageDistance = 0
        self.gnomes = [0] * numGnomes
        for x in range(0, numGnomes):
            self.gnomes[x] = Gnome.Gnome(numCells, durationMatrix, distanceMatrix);

        self.bestDistanceRoute = Gnome.Gnome(numCells, durationMatrix, distanceMatrix);
        self.copy(self.bestDistanceRoute, self.gnomes[0])
        self.computeDistances()

        self.bestDurationRoute = Gnome.Gnome(numCells, durationMatrix, distanceMatrix);
        self.copy(self.bestDurationRoute, self.gnomes[0])
        self.computeDurations()

    # Helper Function: Swaps two gnomes - a normal assignment swap won't work as python will not copy over the cells
    def swap(self, g1, g2):
        newg = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)
        self.copy(newg, g1)
        self.copy(g1, g2)
        self.copy(g2, newg)            
    # Helper Function: Copies the cells in g2 to g1
    def copy(self, g1, g2):
        for x in range(1, self.numCells):
            g1[x] = g2[x]
    # Helper Function: Checks if specified number is in specified list
    def inList(self, num, list):
        for x in range(0, len(list)):
            if (list[x] == num):
                return True
        return False
            
    # These two methods update the shortest distance route and shortest duration route 
    def computeDistances(self):
        for x in range(0, self.numGnomes):
            if(self.gnomes[x].distance < self.bestDistanceRoute.distance):
                self.copy(self.bestDistanceRoute, self.gnomes[x])
    def computeDurations(self):
        for x in range(0, self.numGnomes):
            if(self.gnomes[x].duration < self.bestDurationRoute.duration):
                self.copy(self.bestDurationRoute, self.gnomes[x])

    # These two methods sort gnomes with shortest distance and shortest duration at the top of the list (first index)
    def selectionSortByDistance(self):
        for i in range(0, self.numGnomes):
            bestDisInd = i
            for j in range(i, self.numGnomes):
                if (self.gnomes[j].distance < self.gnomes[bestDisInd].distance):
                    bestDisInd = j
            self.swap(self.gnomes[bestDisInd],self.gnomes[i])
    def selectionSortByDuration(self):
        for i in range(0, self.numGnomes):
            bestDurInd = i
            for j in range(i, self.numGnomes):
                if (self.gnomes[j].duration < self.gnomes[bestDurInd].duration):
                    bestDurInd = j
            self.swap(self.gnomes[bestDurInd],self.gnomes[i])

    # Mutates all gnomes
    def mutateGnomes(self):
        for x in range(0, self.numGnomes):
            self.gnomes[x].mutate(self.mutationRate)      
    # Takes two gnomes parents and crosses them into new child
    def crossOver(self, g1, g2):
        gChild = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)  
        if (self.numCells < 4):
            return gChild
        randNum1 = random.randint(1,self.numCells-2)
        randNum2 = random.randint(randNum1+1,self.numCells-1)
        gChild = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)        

        # Creates a list of all the cells that will be taken from g2 and placed in gChild
        tempList = [0] * (randNum2-randNum1+1)
        index = 0
        for x in range(randNum1, randNum2+1):
            tempList[index] = g2[x]
            index = index+1

        #Take the relavent cells from g1 and place them in gChild
        for y in range(randNum1, randNum2+1):
            gChild[y] = g2[y]

        #Take the relavent cells from g2 and place them in gChild
        nxtSpt = 1
        for x in range(self.numCells-1, 0,-1):
            if (self.inList(g1[x], tempList) == False):
                while (nxtSpt >= randNum1) and (nxtSpt <= randNum2):
                    nxtSpt = nxtSpt + 1
                gChild[nxtSpt] = g1[x]   
                nxtSpt = nxtSpt + 1     
        gChild.calcDis()
        return gChild

    # Creates a new population using the specified number of elites and 
    # the children created by crossing-over the better half of all of the parents
    def createNewDisPop(self):
        self.selectionSortByDistance()        
        newGnomes = [0] * self.numGnomes
        for x in range(0, self.numGnomes):
            newGnomes[x] = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)
        for x in range(0, self.numElites):
            newGnomes[x] = self.gnomes[x]
        for x in range(self.numElites, self.numGnomes):
            num1 = random.randint(0, self.numGnomes/2)
            num2 = num1
            while (num2 == num1):
                num2 = random.randint(0, self.numGnomes/2)
            newGnomes[x] = self.crossOver(self.gnomes[num1], self.gnomes[num2])   
        self.mutateGnomes()
        self.gnomes = newGnomes
        self.computeDistances()
    def createNewDurPop(self):
        self.selectionSortByDuration()        
        newGnomes = [0] * self.numGnomes
        for x in range(0, self.numGnomes):
            newGnomes[x] = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)
        for x in range(0, self.numElites):
            newGnomes[x] = self.gnomes[x]
        for x in range(self.numElites, self.numGnomes):
            num1 = random.randint(0, self.numGnomes/2)
            num2 = num1
            while (num2 == num1):
                num2 = random.randint(0, self.numGnomes/2)
            newGnomes[x] = self.crossOver(self.gnomes[num1], self.gnomes[num2])   
        self.mutateGnomes()
        self.gnomes = newGnomes
        self.computeDurations()
    
    # Overloaded Operator: Returns gnome at specified index
    def __getitem__(self, index):
        if ((index < 0) or (index > self.numGnomes)):
            raise Exception
        return self.gnomes[index]     
    # Print Method: Prints all gnomes
    def printGnomes(self):
        for x in range(0, self.numGnomes):
            self.gnomes[x].printGnome()
