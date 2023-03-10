<h1 align="center">
  <br>
  <img src="https://user-images.githubusercontent.com/8453348/212748934-39d0a25e-eda1-4b97-aa44-d07046e913e0.png" alt="Markdownify" width="200"></a>
  <br>
  Semantic File Search
  <br>
</h1>


<h4 align="center">A semantic search engine built on top of <a href="https://www.sbert.net/" target="_blank">SBERT</a>.</h4>




`Semantic File Search` enables one to upload files to a central database and semantically search through that database later. Each uploaded file is embedded as a vector, and query embeddings are compared against that vector.

Upload Screen
---

The user has the ability to upload text files to the server. Currently, this supports `.txt`, `.pdf`, and `.word` documents. All files that are uploaded get stored on the server with a specified `batch id`. This same id can be used to query the server later. The server embeds all files uploaded into a GraphQL database.

![image](https://user-images.githubusercontent.com/8453348/212256609-3e307455-1bc0-432a-ae9d-e20eac5676ce.png)

## Query Screen
![image](https://user-images.githubusercontent.com/8453348/212256680-41fe85bf-de77-48a5-8b85-291ea56f6221.png)

## Credits


This software uses the following open source packages:

- [Python](https://www.python.org/downloads/)
- [Sentence Transformers](https://www.sbert.net/)


## Developers
This was a joint effort by three developers.   
[ @Veer Singh ](https://github.com/digitalveer)   
[ @Bill Ray ](https://github.com/billray0259)   
[ @Kamran Zolfanoon ](https://github.com/kamraz)   

## License

MIT
