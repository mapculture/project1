# Author:       Kaiser Slocum
# Created:      10/4/2021
# Last Edited:  10/8/2021 
import Gnome, random

class Gnomes(object):
    """
    Gnomes class: 
    Represents a specified collection of Gnomes
    This class is constructed for solving TSP using a genetic algorithm  
    """
    # Constructor
    # NOTE: numCells is the number of unique cells, not the length of the gnome
    def __init__(self, numGnomes=1, numCells=1, durationMatrix = None, distanceMatrix = None):
        if (numCells < 1):
            raise Exception
        self.numGnomes = numGnomes
        self.numCells = numCells
        self.durationMatrix = durationMatrix
        self.distanceMatrix = distanceMatrix
        self.averageDuration = 0
        self.averageDistance = 0
        self.gnomes = [0] * numGnomes
        for x in range(0, numGnomes):
            self.gnomes[x] = Gnome.Gnome(numCells, durationMatrix, distanceMatrix);
        self.createAverages()   

    def swap(self, g1, g2):
        newg = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)
        for x in range(1, self.numCells):
            newg[x] = g1[x]
        for x in range(1, self.numCells):
            g1[x] = g2[x]
        for x in range(1, self.numCells):
            g2[x] = newg[x]

    # Sorts gnomes with shortest distance at the top of the list (first index)
    def selectionSortByDistance(self):
        for i in range(0, self.numGnomes):
            bestDisInd = i
            for j in range(i, self.numGnomes):
                if (self.gnomes[j].distance < self.gnomes[bestDisInd].distance):
                    bestDisInd = j
            self.swap(self.gnomes[bestDisInd],self.gnomes[i])
    # Sorts gnomes with shortest duration at the top of the list (first index)
    def selectionSortByDuration(self):
        for i in range(0, self.numGnomes):
            bestDurInd = i
            for j in range(i, self.numGnomes):
                if (self.gnomes[j].duration < self.gnomes[bestDurInd].duration):
                    bestDurInd = j
            self.swap(self.gnomes[bestDurInd],self.gnomes[i])

    # Boolean, helper function for crossOver method
    # Checks if specified number is in specified list
    def inList(self, num, list):
        for x in range(0, len(list)):
            if (list[x] == num):
                return True
        return False
    # Takes two gnomes parents and crosses them into new child
    def crossOver(self, g1, g2):
        randNum1 = random.randint(1,self.numCells-2)
        randNum2 = random.randint(randNum1+1,self.numCells-1)
        gChild = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)        

        # Creates a list of all the cells that will be taken from g2 and placed in gChild
        tempList = [0] * (randNum2-randNum1+1)
        index = 0
        for x in range(randNum1, randNum2+1):
            tempList[index] = g2[x]
            index = index+1
        print("TempList: ", tempList)

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
        print("gChild: ", gChild.getGnome(), "distance: ", gChild.distance)
        
        #Return the child
        return gChild

    # Creates a new population using the specified number of elites and 
    # the children created by crossing-over the better half of all of the parents
    def createNewDisPop(self, numElites):
        self.selectionSortByDistance()
        newGnomes = [0] * self.numGnomes
        for x in range(0, self.numGnomes):
            newGnomes[x] = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)
        for x in range(0, numElites):
            newGnomes[x] = self.gnomes[x]
        for x in range(numElites, self.numGnomes):
            num1 = random.randint(0, self.numGnomes/2)
            num2 = num1
            while (num2 == num1):
                num2 = random.randint(0, self.numGnomes/2)
            newGnomes[x] = self.crossOver(self.gnomes[num1], self.gnomes[num2])   
        self.mutateGnomes()
        self.gnomes = newGnomes

    def createNewDurPop(self, numElites):
        self.selectionSortByDuration()
        newGnomes = [0] * numGnomes
        for x in range(0, numGnomes):
            newGnomes[x] = Gnome.Gnome(numTarget)
        for x in range(0, numElites):
            newGnomes[x] = self.gnomes[self.numGnomes-x]
        for x in range(numElites, self.numGnomes):
            g1 = random.randInt(self.numGnomes/2, self.numGnomes)
            g2 = g1
            while (g2 == g1):
                g2 = random.randInt(self.numGnomes/2, self.numGnomes)
            newGnomes[x] = crossOver(g1, g2)   
        self.mutateGnomes()
        self.gnomes = newGnomes

    # Calculates the average distance and duration and stores them in class variables
    def createAverages(self):
        totalDis = 0
        totalDur = 0
        for x in range(0, self.numGnomes):
            print(self.gnomes[x].distance)
            totalDis = totalDis + self.gnomes[x].distance
            totalDur = totalDur + self.gnomes[x].duration
        self.averageDistance = totalDis / self.numGnomes
        self.averageDuration = totalDur / self.numGnomes
    # Overloaded Operator: Returns gnome at specified index
    def __getitem__(self, index):
        if ((index < 0) or (index > self.numGnomes)):
            raise Exception
        return self.gnomes[index]
    # Mutates all gnomes
    def mutateGnomes(self):
        for x in range(0, self.numGnomes):
            self.gnomes[x].mutate()   
    # Prints all gnomes
    def printGnomes(self):
        for x in range(0, self.numGnomes):
            self.gnomes[x].printGnome()

    

    
    


