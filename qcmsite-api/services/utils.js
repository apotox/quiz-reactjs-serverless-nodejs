const countTotal = (model, query) =>
  new Promise((resolve, error) => {
    if (query) {
      model.countDocuments(query, (err, count) => {
        if (err) {
          error(err);
        } else {
          resolve(count);
        }
      });
    } else {
      model.estimatedDocumentCount((err, count) => {
        if (err) {
          error(err);
        } else {
          resolve(count);
        }
      });
    }
  });

module.exports = {
  countTotal,
};
