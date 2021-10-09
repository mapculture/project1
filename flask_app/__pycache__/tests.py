import unittest, Gnome, Gnomes, random

class Test_Gnomes_Methods(unittest.TestCase):    
    def test_init(self):
        self.fail("Not implemented")
    def test_inList(self):        
        gnomes = Gnomes.Gnomes(10,10)
        chicken = [1,6,3523,8823,12,4]
        self.assertEqual(gnomes.inList(3523, chicken), True)
        self.assertEqual(gnomes.inList(1, chicken), True)
        self.assertEqual(gnomes.inList(4, chicken), True)
        self.assertEqual(gnomes.inList(99, chicken), False)
    def test_createAverages(self):
        matrix1 = [
        [0,1,1,1,1,1,1,1,1,1], 
        [1,0,1,1,1,1,1,1,1,1],
        [1,1,0,1,1,1,1,1,1,1],
        [1,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,1,0,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,0,1,1],
        [1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,0]]
        matrix2 = [
        [0,2,1,1,1,1,1,1,1,1], 
        [2,0,2,2,2,2,2,2,2,2],
        [1,2,0,1,1,1,1,1,1,1],
        [1,2,1,0,1,1,1,1,1,1],
        [1,2,1,1,0,1,1,1,1,1],
        [1,2,1,1,1,0,1,1,1,1],
        [1,2,1,1,1,1,0,1,1,1],
        [1,2,1,1,1,1,1,0,1,1],
        [1,2,1,1,1,1,1,1,0,1],
        [1,2,1,1,1,1,1,1,1,0]]
        gnomes = Gnomes.Gnomes(10,10,matrix1, matrix2)
        self.assertEqual(gnomes.averageDistance, 12)
        self.assertEqual(gnomes.averageDuration, 10)
    def test_selectionSortByDistance(self):        
        matrix2 = [
        [0,2,1,1,1,1,1,1,1,1], 
        [2,0,2,2,2,2,2,2,2,2],
        [1,2,0,1,1,1,1,1,1,1],
        [1,2,1,0,1,1,1,1,1,1],
        [1,2,1,1,0,1,1,1,1,1],
        [1,2,1,1,1,0,1,1,1,1],
        [1,2,1,1,1,1,0,1,1,1],
        [1,2,1,1,1,1,1,0,1,1],
        [1,2,1,1,1,1,1,1,0,1],
        [1,2,1,1,1,1,1,1,1,0]]
        gnomes = Gnomes.Gnomes(10,10,None, matrix2)
        gnomes.selectionSortByDistance()
        for x in range (0, gnomes.numGnomes):
            for z in range(x+1, gnomes.numGnomes):
                if(gnomes[x].distance > gnomes[z].distance):
                    self.fail("Not sorted")
    def test_selectionSortByDuration(self):
        matrix1 = [
        [0,1,1,1,1,1,1,1,1,1], 
        [1,0,1,1,1,1,1,1,1,1],
        [1,1,0,1,1,1,1,1,1,1],
        [1,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,1,0,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,0,1,1],
        [1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,0]]
        gnomes = Gnomes.Gnomes(10,10,matrix1)
        gnomes.selectionSortByDuration()
        for x in range (0, gnomes.numGnomes):
            for z in range(x+1, gnomes.numGnomes):
                if(gnomes[x].duration > gnomes[z].duration):
                    self.fail("Not sorted")
    def test_crossover(self):        
        gnomes = Gnomes.Gnomes(10,10)
        print("Parent 1: ")
        gnomes[0].printGnome()
        print("Parent 2: ")
        gnomes[1].printGnome()
        gnomes.crossOver(gnomes[0], gnomes[1])    
    def test_mutateGnomes(self):
        temp = random.randint(0, 9)
        gnomes = Gnomes.Gnomes(10,10)
        gnome1 = gnomes[temp]
        print("Two cells should be swapped!")
        print(gnome1.getGnome())
        gnomes.mutateGnomes()
        print(gnome1.getGnome())
        gnomes.mutateGnomes()
        print(gnome1.getGnome())
    def test_createNewDisPop(self):
        self.fail("Not implemented")
    def test_createNewDurPop(self):
        self.fail("Not implemented")

class Test_Gnome_Methods(unittest.TestCase):
    def testCalcDur(self):
        matrix = [
        [0,1,1,1,1,1,1,1,1,1], 
        [1,0,1,1,1,1,1,1,1,1],
        [1,1,0,1,1,1,1,1,1,1],
        [1,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,1,0,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,0,1,1],
        [1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,0]]
        gnomeTest = Gnome.Gnome(10,matrix)
        self.assertEqual(gnomeTest.duration, 10)
    def testCalcDis(self):
        matrix = [
        [0,1,1,1,1,1,1,1,1,1], 
        [1,0,1,1,1,1,1,1,1,1],
        [1,1,0,1,1,1,1,1,1,1],
        [1,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,1,0,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,1],
        [1,1,1,1,1,1,1,0,1,1],
        [1,1,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,0]]
        gnomeTest = Gnome.Gnome(10,None,matrix)
        self.assertEqual(gnomeTest.distance, 10)
    def testMutate(self):
        gnomeTest = Gnome.Gnome(10)
        for x in range(1, 9):
            gnomeTest[x] = x
        gnomeTest.printGnome
        gnomeTest.mutate()
        gnomeTest.printGnome

    def testGetGnome(self):
        gnomeTest = Gnome.Gnome(10)
        for x in range(1, 10):
            gnomeTest[x] = x
        self.assertEqual(gnomeTest.getGnome(), [0,1,2,3,4,5,6,7,8,9,0])

    def testgetitem(self):
        gnomeTest = Gnome.Gnome(10)
        for x in range(1, 10):
            gnomeTest[x] = 0
        self.assertEqual(gnomeTest.getGnome(), [0,0,0,0,0,0,0,0,0,0,0])
        with self.assertRaises(Exception):
            gnomeTest[-1]
        with self.assertRaises(Exception):
            gnomeTest[11]

    def testsetitem(self):
        gnomeTest = Gnome.Gnome(10)
        for x in range(1, 10):
            gnomeTest[x] = 0
        self.assertEqual(gnomeTest.getGnome(), [0,0,0,0,0,0,0,0,0,0,0])
        gnomeTest[1] = 2
        self.assertEqual(gnomeTest.getGnome(), [0,2,0,0,0,0,0,0,0,0,0])
        gnomeTest[7] = 2
        gnomeTest[8] = 2
        self.assertEqual(gnomeTest.getGnome(), [0,2,0,0,0,0,0,2,2,0,0])
        with self.assertRaises(Exception):
            gnomeTest[0] = 2
        with self.assertRaises(Exception):
            gnomeTest[10] = 3
        with self.assertRaises(Exception):
            gnomeTest[14] = 4
        with self.assertRaises(Exception):
            gnomeTest[-1] = 5

if __name__ == '__main__':
    unittest.main()
