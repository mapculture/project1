TSP Genetic Algorithm:
Traveling-Salesperson-Algorithm:

Description:
The TSP Genetic Algorithm is advanced technology that chooses best routes to create more 
routes - thereby eventually returning more and more efficient path solutions.

Representation:
A Gnome is the path from the starting place to all destinations.
Destinations and the starting place are represented by cells in the Gnome.
The Gnome must start and end at the same place.

TSPGeneticAlgorithm.py (Main File):
The TSPGeneticAlgorithm.py has two methods that accept the number of unique cities, a distance/duration matrix
(depending on what defines a "optimum" path), and the number of seconds the algorithm is allowed to compute for.
Obviously, the smaller number of cells, the less time is needed but on average, five seconds is plenty enough to
find the optimum solution for a ten cell gnome (ten places on a path).
As the program has no real way of knowing if it has found the optimum solution, it will continue
to run until the number of specified seconds has been reached.

Gnomes.py:
This is the Gnomes class.  It is a list of gnomes specified by the numPop variable.
This class calls appropriate methods in the Gnome class to complete the methods.
Within the createNew___Pop() method, (distance or duration), the class handles the crossovers,
mutations, basic error handling, and everything else needed.

Gnome.py:
This is the Gnome class.  It defines what a Gnome (path) is and can perform a mutation.

Other Information:
There are three main variables that affect the application for a given number of cells:
Population Size: The number of possible paths in a given generation - this will not change 
after the the first generation dictates the size.
Number of Elites: the number of best paths that are moved automatically to the next generation,
although they will still be mutated
Mutation rate: The percentage number of gnomes that are mutated.

As a generality, a larger population size is better as the chance of finding the optimum route in the populatio increase with the size.
However, creating a larger population drastically increases the time needed to create a population and create a new populatio of that.
The number of Elites helps the algorithm to arrive at a semi-optimum route faster, but suffers from converging on a route that
may not be the most optimum.
The mutation rate affects how quickly the algorithm will reach an optimum solution and how methodically it will do so.  A larger
mutation rate ensures the algorithm is continuously trying new and slightly different routes which increases the liklihood of
reaching the optimum solution.  However, a smaller mutation rate allows the algorithm to frequently reach the solution faster
since the gnomes are not constantly changing.
In general, a larger mutation rate should accompany a larger number of elites.  