import "/js/Loader/Loaded.js";
// import "/js/Tags.js#ignore";

// Here we don't construct the Main class,
// unlike the public Start.js
// This is because Main gets constructed by the Loader
// This is important so that the loader can invoke main even when
// the file hasn't refreshed, as happens on unchanged soft reloads
export * from "/js/Main.js";