#
# Adjacency Matrix Initialization and Population
# ======= MapCultire.co =======
# Written By: Jordan Whiteley
#

#Create/Populate Adj Matrix
class Graph:

    # Initialize empty (filled w 0's) adj_matrix
    def __init__ (self, dim):
        self.adj_matrix = list()
        for i in range(dim):
            self.adj_matrix.append(0 for i in range(dim))
        self.dim = dim

    # return the row/col length
    def __len__(self):
        return self.dim

    # Add an edge to the adj_matrix (1 meaning there is a connection)
    # Weight not displayed in adj_matrix
    def add_edge(self, p1, p2, weight):
        if (p1 == p2):
            print("This is the same vertex, cannot add edge.")
        self.adj_matrix[p1][p2].append(int(weight))
        self.adj_matrix[p2][p1].append(int(weight))

    # Remove an edge to the adj_matrix (0 meaning returning to original state)
    # Weight not displayed in adj_matrix
    def remove_edge(self, p1, p2):
        if (p1 == p2):
            print("This is the same vertex, cannot remove edge.")
        self.adj_matrix[p1][p2].append(0)
        self.adj_matrix[p2][p1].append(0)

    def weight_present(self, p1, p2):
        if (p1 != p2):
            if (self.adj_matrix[p1][p2] is 0):
                return False
            else:
                return True

    def print_matrix(self):
        for i in self.adj_matrix:
            for j in i:
                print(j, end=' ')
            print()
