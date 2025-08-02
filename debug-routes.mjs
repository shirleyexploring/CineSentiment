// debug-routes.mjs
import express from 'express';

function wrap(obj, method) {
  const original = obj[method];
  obj[method] = function (path, ...rest) {
    // Express lets you omit the path; guard for that.
    if (typeof path === 'string') {
      console.log(`⇢ ${method} → "${path}"`);
    }
    return original.call(this, path, ...rest);
  };
}

// Patch **all** three
wrap(express.application, 'use');     // app.use(...)
wrap(express.Router,       'use');     // router.use(...)
wrap(express.Router,       'route');   // router.route(...)

