import {mongodb} from "/js/External/MongoDB.js";
import {Uint8Array} from "/js/TypedArray.js";
import {ObjectID as PublicObjectID} from "/js/Utility/Database/ObjectID.js?after=/taggly/private";

// // If mongodb is installed, use its ObjectID, otherwise fall back on the public custom implementation
// export const ObjectID = mongodb?.ObjectID ?? PublicObjectID;

export let ObjectID = undefined;

if (mongodb?.ObjectID)
{
  mongodb.ObjectID.Encode = function(buffer, object_id)
  {
    Uint8Array.Encode(buffer, object_id.id);
  }

  mongodb.ObjectID.Decode = function(buffer, object_id)
  {
    const value = Uint8Array.Decode(buffer);
    return new mongodb.ObjectID(value);
  }

  ObjectID = mongodb.ObjectID;
}
else
{
  ObjectID = PublicObjectID;
}