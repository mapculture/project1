import random, operator, Destination, Gnome, Gnomes
#https://towardsdatascience.com/evolution-of-a-salesman-a-complete-genetic-algorithm-tutorial-for-python-6fe5d2b3ca35
#https://www.geeksforgeeks.org/traveling-salesman-problem-using-genetic-algorithm/
#https://www.hindawi.com/journals/cin/2017/7430125/

#gno = createGnomes(5,4)
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


for i in range(0, 10):
    for j in range(0, 10):
        matrix1[i][j] = random.randint(1, 99)
for i in range(0, 10):
    print("[", end="")
    for j in range(0, 10):
        print(matrix1[i][j], ",", end="")
    print("]")



gnomes = Gnomes.Gnomes(10,10,matrix1,matrix1)
gnomes.printGnomes()
print(" ")
gnomes.selectionSortByDistance()
gnomes.printGnomes()
gnomes.createNewDisPop(1)
gnomes.selectionSortByDistance()
gnomes.printGnomes()
gnomes.createNewDisPop(1)
gnomes.selectionSortByDistance()
gnomes.printGnomes()






