const express = require("express");
var axios = require("axios");

// function to get the data from the API
let getTypeaheadResults = async (queryString, filterArray, page, limit) => {

  var searchTerm = {
    $search: {
      autocomplete: {
        query: queryString,
        path: "displayName",
      },
    },
  };

  var projectStage = {
    "$project": {
        "_id": 0,
        "displayName": 1,
        "id": 1,
        "image": "$thumbnailImage.url"
    }
};
  //limit stage is not allowed in atlas M0 cluster
  var limitStage = {
    limit: limit,
  };

  var fullQuery = {
    collection: "ecomProductCatalog",
    database: "eComSearch",
    dataSource: "eComSearch",
    pipeline: [searchTerm, projectStage],
  };

  var data = JSON.stringify(fullQuery);

  var config = {
    method: "post",
    url: "https://data.mongodb-api.com/app/data-tfkyx/endpoint/data/beta/action/aggregate",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key":
        "U7TVtdFfo9vwKfEZCWoCJ9VZq675Kr7swo8ezRL5RghC6AqQK1V71iEjnbxneyvQ",
    },
    data: data,
  };
  console.log(config);
  let response = await axios(config);
  return response.data;
};
//controller function
module.exports = async (req, res) => {
  // Access the provided 'page' and 'limt' query parameters
  let queryString = req.query.query;
  let filterArray = req.query.filter;
  let page = req.query.page;
  let limit = req.query.limit;
  //let limit = req.query.limit;
  let responseResults = await getTypeaheadResults(
    queryString,
    filterArray,
    page,
    limit
  );
  res.send(responseResults.documents);
};
