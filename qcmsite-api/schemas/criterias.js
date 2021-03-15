const DEFAULT_FILTERS_INPUT = {
  skip: 0,
  limit: 25,
  sort: -1,
  sortby: "createdAt",
};

const safeCriteria = (search)=>{
  if(!search) return null

  return Object.keys(search).filter(k=> !`${k}`.startsWith("$")).reduce((obj,cur)=>{
    return {
      ...obj,
      [cur]: search[cur]
    }
  },{})

}

const createCriteria = ({ schema }, input,defaultCriteria={}) => {
  if (!input) return {};
  let { obj } = schema;

  //createdAt:"2020-02-01|2002-01-22"
  let criteria = defaultCriteria;
  
  
  for (att in obj) {



    
    if (!input[att]) continue;

    if (att == "attributes") {
      
      let attributes = input["attributes"] || [];

      attributes.forEach((attr) => {
        if (attr.value && attr.key) {
          criteria[`attributes.${attr.key}`] = attr.value;
        }
      });
    } else if (obj[att].type.name == "String") {
      if (obj[att].enum) {
        criteria[att] = input[att];
      } else {
        criteria[att] = {
          $regex: new RegExp(input[att], "i"),
        };
      }
    } else if (obj[att].type.name == "Number") {
      if (typeof input[att] == "string" && input[att].indexOf("|") > -1) {
        let start = 1 * input[att].split("|")[0];
        let end = 1 * input[att].split("|")[1];
        criteria[att] = {
          $gte: start,
          $lte: end,
        };
      } else {
        criteria[att] = input[att] * 1;
      }
    } else if (obj[att].type.name == "Date") {
      if (input[att].indexOf("|") > -1) {
        let start = input[att].split("|")[0];
        let end = input[att].split("|")[1];
        start = start == "0" ? new Date(0, 0, 0) : new Date(start);
        end = end == "0" ? new Date(9999, 0, 0) : new Date(end);
        criteria[att] = {
          $gte: start,
          $lte: end,
        };
      } else {
        let start = new Date(input[att]).setHours(0, 0, 0, 0);
        let end = new Date(input[att]).setHours(23, 59, 59, 999);
        criteria[att] = {
          $gte: start,
          $lte: end,
        };
      }
    } else {
      criteria[att] = input[att];
    }
  }

  



  console.log("criteria", criteria);
  return criteria;
};

const makeQuery = (model, criteria, filter, project = null) => {
  return model
    .find(
      {
        ...criteria,
      },
      project,
      { skip: filter.skip }
    )
    .sort({ [filter.sortby]: filter.sort })
    .limit(filter.limit);
};

module.exports = {
  createCriteria,
  DEFAULT_FILTERS_INPUT,
  makeQuery,
  safeCriteria
};
