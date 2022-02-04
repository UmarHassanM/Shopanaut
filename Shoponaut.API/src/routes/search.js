const express = require("express");
var axios = require("axios");
const atlasSearchBuilder = require("../searchUtils/atlasSearchBuilder");

// function to get the data from the API
let getSearchResults = async (queryString, filterArray, page, limit) => {
  var searchTerm = {
    $search: {
    facet: {
      operator: {
        "compound": {
          "should": [
            { 
              "text": { 
                  "path": "ancestorCategories", 
                  "query": queryString, 
                  "score": { 
                      "constant": { 
                          "value": 2
                      }
                  }
              }
          },
            { 
                "text": { 
                    "path": "displayName", 
                    "query": queryString, 
                    "score": { "boost": { "value": 3 } 
                  }
                }
            },
            { 
              "text": { 
                  "path": "description", 
                  "query": queryString, 
                  "score": { 
                      "boost": { 
                          "value": 2
                      }
                  }
              }
          }
        ],
          "must":[{
            text: {
              path: ["displayName","description","keywords","longDescription"],
              query: queryString,
              fuzzy: {maxEdits: 1.0}
            }
          }],
          "filter": [],
          "minimumShouldMatch": 0
        }
      },
      facets: {
        Color: {
          type: 'string',
          path: 'skuColors'
        },
        Size: {
          type: 'string',
          path: 'skuSizes'
        },
        Feature: {
          type: 'string',
          path: 'features'
        },
        Brand: {
          type: 'string',
          path: 'brand'
        },
        Category: {
          type: 'string',
          path: 'ancestorCategories'
        },
        Price :{
          type: "number", 
          path: "price",
          boundaries: [25,50,100,200,500],
          default: "other"
        }
      }
    },
    "highlight": {
      "path": {
        wildcard: "*"
      }
    }
  }
  };

  var scoreStage = {
    "$set": {
        "score": { "$meta": "searchScore" },
        "highlights": { "$meta": "searchHighlights" }
    }
}
var projectStage = {
  "$project": {
      "childSKUs":0
  }
}
  pipelineStages = [];
  
  filtersConstruct = [];

  //All Facets are processed here
  if (atlasSearchBuilder.shouldBuildMatchCondition(filterArray.Category)) 
  filtersConstruct.push(atlasSearchBuilder.buildMatchCondition("ancestorCategories", filterArray.Category));
  if (atlasSearchBuilder.shouldBuildMatchCondition(filterArray.Brand)) 
  filtersConstruct.push(atlasSearchBuilder.buildMatchCondition("brand", filterArray.Brand));
  if (atlasSearchBuilder.shouldBuildMatchCondition(filterArray.Feature))  
  filtersConstruct.push(atlasSearchBuilder.buildMatchCondition("features", filterArray.Feature));
  if (atlasSearchBuilder.shouldBuildMatchCondition(filterArray.Color)) 
  filtersConstruct.push(atlasSearchBuilder.buildMatchCondition("skuColors", filterArray.Color));
  if (atlasSearchBuilder.shouldBuildMatchCondition(filterArray.Size)) 
  filtersConstruct.push(atlasSearchBuilder.buildMatchCondition("skuSizes", filterArray.Size));
  
  
  //TODO add Price Range Facet

 
  if (atlasSearchBuilder.shouldBuildMatchCondition(filtersConstruct)) {
    searchTerm['$search'].facet.operator.compound['filter'] = filtersConstruct;
  }

  pipelineStages.push(searchTerm);
  pipelineStages.push(scoreStage);
  pipelineStages.push(projectStage);
  pipelineStages.push(atlasSearchBuilder.buildFacetsMetaData(100));

  let response = await axios(atlasSearchBuilder.buildAxiosConfig(pipelineStages));
  return response.data;
};
//controller function
module.exports = async (req, res) => {
  // Access the provided 'page' and 'limt' query parameters
  let queryString = req.query.query;
  let filterArray = req.body;
  let page = req.query.page;
  let limit = req.query.limit;
  let facetsMap = req.query.limit;
  let responseResults = await getSearchResults(
    queryString,
    filterArray,
    page,
    limit
  );
  res.send(responseResults.documents[0]);
};
