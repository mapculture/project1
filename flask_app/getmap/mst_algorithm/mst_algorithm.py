#####################################
#         Jordan W - prim MST       #
#     Created: October 8th, 2021    #
#  Last edited: October 15th, 2021  #
#####################################
"""
This algorithm takes an 2 params, those being
(num_node, adjMatrix), which are the number of nodes/locations
used in the search, and a num_node x num_node adjacency matrix
with the weights of each edge pair.
"""

import math
#import sys
#from time import time

def primMST(num_node, adjMatrix):
    if (num_node != len(adjMatrix)):
        print("{} Is not equal to {} -> (NxN) adjency matrix".format(num_node, len(adjMatrix)))
        return -1
    #Create maximum boundary for to help initiate automatic minimum
    inf = math.inf
    #Populate the node selection for specific row
    select_node = [0 for _ in range(num_node)]
    #Add origin node to the visited list
    select_node[0] = True

    #Tracking to make sure each node is visited only once
    track = 0
    #Reroute output to output.txt(can be variable)

    #Initialize return array
    # array = list()
    array1 = list()
    array1.append(0)

    #Iterate through graph (0,n-1)
    while(track < num_node - 1):
        #init minimum w/ inf
        min = inf
        v1 = 0
        v2 = 0
        #Iterate through rows
        for i in range(num_node):
            #True for weight present except for starting node [0,0]
            if select_node[i]:
                #Iterate through columns
                for j in range(num_node):
                    #if the node is ot in the selected nodes and it is presen
                    #in the adjMatrix
                    if ((not select_node[j]) and adjMatrix[i][j]):
                        #Update minimum cost in min and update verticies
                        if min > adjMatrix[i][j]:
                            min = adjMatrix[i][j]
                            #Update verticies in list
                            v1 = i
                            v2 = j

        #Print edges with weights attached
        # array.append(adjMatrix[v1][v2])
        # array1.append(v1)
        array1.append(v2)
        #Add vertex to visited node list
        select_node[v2] = True
        #increment counter for visited verticies
        track += 1

    #Append final path from last node to start node
    # array.append(adjMatrix[array1[-1]][0])
    # array1.append(array1[-1])
    array1.append(0)
    # print(array)
    print(array1)
    # print(sum(array))
    #Close the open file
