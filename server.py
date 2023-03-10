import numpy as np
import flask
from lib.encoders import TextEncoderPipeline, QueryPipeline
import random
import pandas as pd

from threading import Thread

from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)

app = flask.Flask(__name__)

encoder_pipeline = TextEncoderPipeline()
query_pipeline = QueryPipeline()

connections.connect(host="192.168.0.128", port="19530") # TODO make this connect to the milvus container instead of this specific IP

def batch_id_to_collection_name(batch_id):
    return f"batch_{batch_id}"

def batch_id_to_collection(batch_id):
    fields = [
        FieldSchema(name="pk", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=768),
        FieldSchema(name="file", dtype=DataType.VARCHAR, max_length=1024),
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=1024)
    ]
    schema = CollectionSchema(fields, "a basic schema for a batch of embeddings")
    batch = Collection(batch_id_to_collection_name(batch_id), schema)
    return batch


def update_database(data, batch_id):
    collection = batch_id_to_collection(batch_id)

    entities = {
        "embeddings": [],
        "file": [],
        "text": []
    }
    
    for sample in data:
        file = sample["file"]
        text = sample["text"]
        text_chunks, embeddings = encoder_pipeline(text)
        file_name_chunks, file_name_embeddings = encoder_pipeline(file)

        text_chunks.extend(file_name_chunks)
        
        if len(embeddings) == 0:
            embeddings = file_name_embeddings
        else:
            embeddings = np.concatenate([embeddings, file_name_embeddings], axis=0)



        for chunk, embedding in zip(text_chunks, embeddings):
            # hash the text to make a key
            # key = str(uuid.uuid3(uuid.NAMESPACE_DNS, chunk))
            # Currently using Milvus auto_id
            entities["embeddings"].append(np.array(embedding, dtype=float).reshape(-1))
            entities["file"].append(str(file))
            entities["text"].append(str(chunk))



    collection.insert(pd.DataFrame(entities))

    collection.create_index("embeddings", {
        "index_type": "FLAT",
        "metric_type": "IP",
        "params": {}
    })


def get_batch_status(batch_id):
    return utility.has_collection(batch_id_to_collection_name(batch_id))

'''
{
    "status": "ok",
    "data": [
        {
            "filepath": "pwd/file1",
            "text": "some text",
            "similarity": 22.11,
        },
        {
            "filepath": "pwd/file2",
            "text": "some text2",
            "similarity": 15.11,
        },
    ]
}
'''


def search_database(query, batch_id):
    if not get_batch_status(batch_id):
        return {"message": "Batch not found"}, 404

    collection = batch_id_to_collection(batch_id)
    collection.load()

    query_embedding = query_pipeline(query)

    results = collection.search(
        query_embedding.reshape(1, -1),
        "embeddings",
        {"metric_type": "IP"},
        limit=10, # TODO make this configurable
        output_fields=["file", "text"]
    )

    collection.release()

    results = [
        {
            "filepath": result.entity.get("file"),
            "text": result.entity.get("text"),
            "similarity": str(result.distance),
        }
        for result in results[0]
    ]

    return results
    
# accept post requests
'''
POST /data_upload/
    {
        "data": [
            {
                "file": "pwd/file1",
                "text": "some text",
            },
            {
                "file": "pwd/file2",
                "text": "some text2",
            },
        ]
    }
'''


@app.route('/data_upload/', methods=['POST', 'GET'])
def data_upload():
    # if the request is a POST request
    if flask.request.method == 'POST':
        data = flask.request.get_json()["data"]

        batch_id = data["batch_id"]

        # open separate thread to do the heavy lifting
        thread = Thread(target=update_database, args=(data, batch_id))
        thread.start()

        # return batch id with status 200
        return flask.jsonify({"batch_id": batch_id}), 200
    
    # if the request is a GET request
    else:
        # get the batch id
        batch_id = flask.request.args.get("batchId")
        # check if the batch id is in the database
        if get_batch_status(batch_id):
            # return with status 200
            return flask.jsonify({"status": "done"}), 200
        else:
            # return with status 202
            return flask.jsonify({"status": "in progress"}), 202



# search endpoint
'''
GET /search/
    {
        "batchId": "1",
        "query": "some text",
        OPTIONAL:
        "filepath": "pwd/",
    }
Return value:
    {
        "status": "ok",
        "data": [
            {
                "filepath": "pwd/file1",
                "text": "some text",
                "similarity": 22.11,
            },
            {
                "filepath": "pwd/file2",
                "text": "some text2",
                "similarity": 15.11,
            },
        ]
    }
'''


@app.route('/search/', methods=['GET'])
def search():
    data = flask.request.get_json()
    batch_id = data["batchId"]
    query = data["query"]
    filepath = data.get("filepath", None)

    if not get_batch_status(batch_id):
        # return 404
        return flask.jsonify({"status": "error", "message": "batch id not found"}), 404

    results = search_database(query, batch_id)

    # return results with status 200
    return flask.jsonify({"status": "ok", "data": results}), 200





# index page says "Semantic Search Server is Online"
# Good to have the health check in place
@app.route('/')
def index():
    return "Semantic Search Server is Online"

if __name__ == '__main__':
    # run on 0.0.0.0:8000
    app.run(host='0.0.0.0', port=8000)
    
    
 
