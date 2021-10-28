# Author:       Kaiser Slocum
# Created:      10/4/2021
# Last Edited:  10/18/2021 
#import Gnome, random
import random
from . import Gnome

class Gnomes(object):
    """
    Gnomes class: 
    Represents a specified collection of Gnomes
    This class is constructed for solving TSP using a genetic algorithm  
    """
    # Constructor
    # NOTE: numCells is the number of unique cells, not the length of the gnome
    def __init__(self, numGnomes=1, numCells=1, numElites=1,mutationRate=0.1, durationMatrix = None, distanceMatrix = None):
        # Simple error handling - we must have the number of cells equal to the number of columns and the number of rows of the matrix
        if (numCells < 1):
            raise Exception("Too few number of cells!")
        if ((durationMatrix != None) and ((numCells != len(durationMatrix)) or (numCells != len(durationMatrix[0])))):
            raise Exception("Nume of cells in durationMatrix does not match numCells Arg!")  
        if ((distanceMatrix != None) and ((numCells != len(distanceMatrix)) or (numCells != len(distanceMatrix[0])))):
            raise Exception("Nume of cells in distanceMatrix does not match numCells Arg!")  
        
        # We need to store all our values in these variables
        self.mutationRate = mutationRate
        self.numGnomes = numGnomes
        self.numElites = numElites
        self.numCells = numCells
        self.durationMatrix = durationMatrix
        self.distanceMatrix = distanceMatrix        
        self.gnomes = [0] * numGnomes
        for x in range(0, numGnomes):
            self.gnomes[x] = Gnome.Gnome(numCells, durationMatrix, distanceMatrix);

        # We want to always keep a copy of the best distance route that has ever been computed - regardless of the current generation
        self.bestDistanceRoute = Gnome.Gnome(numCells, durationMatrix, distanceMatrix);
        self.copy(self.bestDistanceRoute, self.gnomes[0])
        self.computeDistances()

        # We want to always keep a copy of the best duration route that has ever been computed - regardless of the current generation
        self.bestDurationRoute = Gnome.Gnome(numCells, durationMatrix, distanceMatrix);
        self.copy(self.bestDurationRoute, self.gnomes[0])
        self.computeDurations()

    # Helper Function: Swaps two gnomes - a normal assignment swap won't work as python will not copy over the cells
    def swap(self, g1, g2):
        newg = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix)
        # Copy the g1 to a temporary gnome, than copy g2 onto g1, and then temporary gnome onto g2
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
        # If we reach here, than the specified number is not in the list
        return False
            
    # These two methods update the shortest distance route and shortest duration route 
    # They do NOT update each gnome's duration/distance as that should have been already done
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
        # For each gnome in the list of gnomes
        for i in range(0, self.numGnomes):
            bestDisInd = i
            # Find the shortest distance gnome
            for j in range(i, self.numGnomes):
                if (self.gnomes[j].distance < self.gnomes[bestDisInd].distance):
                    bestDisInd = j
            # Place it at the next index at the front of the gnome list
            self.swap(self.gnomes[bestDisInd],self.gnomes[i])
    def selectionSortByDuration(self):
        # For each gnome in the list of gnomes
        for i in range(0, self.numGnomes):
            bestDurInd = i
            # Find the shortest duration gnome
            for j in range(i, self.numGnomes):
                if (self.gnomes[j].duration < self.gnomes[bestDurInd].duration):
                    bestDurInd = j
            # Place it at the next index at the front of the gnome list
            self.swap(self.gnomes[bestDurInd],self.gnomes[i])

    # Mutates all gnomes
    def mutateGnomes(self):
        for x in range(0, self.numGnomes):
            # The mutation is handled exclusively in the Gnome class, we just need to call the mutate method
            # if our random number between 0 and 1 is less than or equal to the mutation rate
            if (random.random() <= self.mutationRate):
                self.gnomes[x].mutate()      
    # Takes two gnomes parents and crosses them into new child
    def crossOver(self, g1, g2):
        # Create the child gnome -  we can throw in random cell values - we'll copy over them all later anyway
        gChild = Gnome.Gnome(self.numCells, self.durationMatrix, self.distanceMatrix) 
        # If there are less than four cells, crossing-over does nothing
        if (self.numCells < 4):
            return gChild
        # We need to get two random numbers - specifing the start and end indices for the chunk of cells we are crossing over form g2
        randNum1 = random.randint(1,self.numCells-2)
        randNum2 = random.randint(randNum1+1,self.numCells-1)     

        # Creates a list of all the cells that will be taken from g2 and placed in gChild
        tempList = [0] * (randNum2-randNum1+1)
        index = 0
        for x in range(randNum1, randNum2+1):
            tempList[index] = g2[x]
            index = index+1

        # Take the relavent cells from g2 and place them in gChild
        # This is the g2 cells that we are splicing into the g1 parent
        for y in range(randNum1, randNum2+1):
            gChild[y] = g2[y]

        # Take the relavent cells from g1 and place them in gChild
        # We now fill in the rest of the spots in gchild with the g1 cells
        nxtSpt = 1
        for x in range(self.numCells-1, 0,-1):
            if (self.inList(g1[x], tempList) == False):
                while (nxtSpt >= randNum1) and (nxtSpt <= randNum2):
                    nxtSpt = nxtSpt + 1
                gChild[nxtSpt] = g1[x]   
                nxtSpt = nxtSpt + 1          
        return gChild

    # Creates a new population using the specified number of elites and 
    # the children created by crossing-over the better half of all of the parents
    def createNewDisPop(self):
        # We need to sort the list of gnomes first by distance so that all the best gnomes are the first items in the list
        self.selectionSortByDistance()   
        # Here we declare a list of gnomes, but don't actually fill it with gnomes yet
        newGnomes = [0] * self.numGnomes    
        # Here we fill in the newGnomes generation with the number of elites
        # We are NOT copying gnomes over from the old generation, instead we are still just referencing them
        # if the old generation gnomes are changed, so will the new generation of gnomes that have been transferred
        for x in range(0, self.numElites):
            newGnomes[x] = self.gnomes[x]
        # To fill in the rest of the generation to be the same size as the old generation, we will cross over the better half of the parent generation
        for x in range(self.numElites, self.numGnomes):
            # num1 is a random gnome index in the better half of the old generation
            num1 = random.randint(0, self.numGnomes/2)
            num2 = num1
            # num2 i a random gnome index in the better half of the old generation that is NOT the same as num1
            while (num2 == num1):
                num2 = random.randint(0, self.numGnomes/2)
            # We cross over to create a new gnome child
            newGnomes[x] = self.crossOver(self.gnomes[num1], self.gnomes[num2])   
        # Mutate the gnomes according to the mutation rate
        self.mutateGnomes()
        # set the self.gnomes equal to the new generation
        self.gnomes = newGnomes
        # Now see if we have a better distance or duration now to update the best route to-date
        self.computeDistances()
        self.computeDurations()
    # NOTE: this method is identical to the createNewDisPop(self) except that we replace most of the "distance" with "duration
    def createNewDurPop(self):
        self.selectionSortByDuration()        
        newGnomes = [0] * self.numGnomes        
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
        self.computeDistances()
    
    # Overloaded Operator: Returns gnome at specified index
    # If we index a class object, we actually want the gnome from the self.gnomes list - we don't want to type gnomes.gnomes[index]
    # so i override the index operator so we only have to type gnomes[index]
    def __getitem__(self, index):
        if ((index < 0) or (index > self.numGnomes)):
            raise Exception
        return self.gnomes[index]     
    # Print Method: Prints all gnomes
    def printGnomes(self):
        for x in range(0, self.numGnomes):
            self.gnomes[x].printGnome()
