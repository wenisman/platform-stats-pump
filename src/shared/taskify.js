const Task = require('data.task');

module.exports = (fn, context) => {
  return function() {
    const args = Array.from(arguments);
    return new Task(function(reject, resolve) {
      args.push(function(err, status, data) {
        if (err) {
          reject(err);
        } else {
          if (!data) {
            data = status;
          }

          resolve(data);
        }
      });
      fn.apply(context, args);
    });
  };
};
