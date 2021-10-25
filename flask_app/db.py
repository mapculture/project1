"""
Database insertion and retrieval
"""
from pymongo import MongoClient
from flask import current_app

class Mongodb:
    def __init__(self, client_name="testclient"):
        self.client_name = client_name
        self.client = None
        self.db = None
        self.collection = None

    def connect(self):
        self.client = MongoClient('mongodb://' + self.client_name, 27017)

    def set_data(self, db_name):
        self.db = self.client[db_name]

    def set_collection(self, collection_name):
        self.collection = self.db[collection_name]

    def insert(self, row):
        self.collection.insert_one(row)

    def delete_rows(self):
        self.collection.delete_many({})

    def list_rows(self):
        return list(self.collection.find())
