module.exports = {
  buildAxiosConfig:function(pipelineStages) {
    var fullQuery = {
      collection: "ecomProductCatalog",
      database: "eComSearch",
      dataSource: "eComSearch",
      pipeline: pipelineStages,
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
    return config;
},
    limitStage:function(count) {
        return {
            limit: count,
          };
    },
    shouldBuildMatchCondition(selectedFacets){
        if (selectedFacets){
            if (selectedFacets.length > 0) return true;
        }
        return false;
     },
    buildMatchCondition(fieldNameValue,selectedFacets){
        // {
        //   text: {
        //     path: "brand",
        //     query: ["Adriana Olivier"],
        //   }
        // }

        var match = {};
        var condition ={};
        condition['path'] = fieldNameValue;
        condition['query'] = selectedFacets;
        match['text']=condition;
        return match;
 
     },
     buildRangeCondition(fieldNameValue,selectedFacets){

      const map1 = new Map();

      map1.set('25', {'min':25,'max':50});
      map1.set('50', {'min':50,'max':100});
      map1.set('100', {'min':100,'max':200});
      map1.set('200', {'min':200,'max':500});


      var range = {};
      var condition ={};
      condition['path'] = fieldNameValue;
      condition['gt'] = selectedFacets;
      condition['lt'] = selectedFacets;
      range['range']=condition;
      return range;
                 
    },
    buildFacetsMetaData(count){
       return {
        "$facet": {
          "docs": [
            {"$limit": count}
          ],
          "meta": [
            {"$replaceWith": "$$SEARCH_META"},
            {"$limit": 1}
          ]
        }
      }
    }
}