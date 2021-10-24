from pymongo import MongoClient

class Mongodb:
    def __init__(self, client_name="testclient"):
        self.client_name = client_name
        self.client = None
        self.db = None
        self.collection = None

    def connect(self):
        self.client = MongoClient('mongodb://' + self.client_name, 27017)

    def set_data(self, name):
        self.db = self.client[name]

    def set_collection(self, collection_name):
        self.collection = self.db[collection_name]

    def insert(self, row):
        self.collection.insert_one(row)

    def list_rows(self):
        return list(self.collection.find())

    def generate_id(self):
        return self.collection.find().count() + 1

    def f_find(self, fields=[], query={}):
        _dict = {}
        for f in fields:
            _dict[f] = 1
        _dict["_id"] = 0

        rows = []
        for row in self.collection.find(query, _dict):
            rows.append(row)
        return rows

    def f_top(self, fields, k):
        _dict = {}
        for f in fields:
            _dict[f] = 1
        _dict["_id"] = 0

        return list(self.collection.find({}, _dict).sort("km").limit(k))
