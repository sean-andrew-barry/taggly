import {mongodb} from "/js/External/MongoDB.js";
import {Binary as PublicBinary} from "/js/Utility/Database/Binary.js?after=/taggly/private";

// If mongodb is installed, use its Binary, otherwise fall back on the public custom implementation
export const Binary = mongodb?.Binary ?? PublicBinary;
