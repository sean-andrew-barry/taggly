import "/flag#json";
export * from "/js/Constants.js?after=/taggly/public/" assert { type: "json" };
// This file exists because there needs to be a public version that can import the private Constants
// Otherwise a public search, like what the HTTP Server will do, wouldn't find it.