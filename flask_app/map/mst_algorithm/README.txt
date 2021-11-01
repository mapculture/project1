TSP Minimum Spanning Tree Algorithm

Description:
This algorithm creates a minimum spanning tree given the number of locations
that need to be visited and an adjacency matrix.

mst_algorithm.py:
This is the only file needed for the algorithm as it is not super lengthy.
First is error checking to make sure the number of locations entered matches that
of the adjacency matrix given.

Then we enter the origin node into the "visited" list and begin scanning the
edge weights, selecting the smallest weight edge each time and adding that
vertex to the visited list. Doing this until each node has been visited in the graph.

Then the last node that was visited gets attached back to the origin creating a
hamiltonian cycle.
