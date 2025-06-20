const pagination = (model, populateOptions = []) => {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Base query (e.g. passed by previous middleware/controller)
      const baseQuery = req.baseQuery || {};

      // Filters
      const city = req.query.city;
      const search = req.query.search;

      if (city) {
        baseQuery.city = { $regex: new RegExp(city, 'i') };
      }

      if (search) {
        baseQuery.$or = [
          { name: { $regex: new RegExp(search, 'i') } },
          { description: { $regex: new RegExp(search, 'i') } },
        ];
      }

      let query = model.find(baseQuery);

      populateOptions.forEach((pop) => {
        query = query.populate(pop);
      });

      const total = await model.countDocuments(baseQuery);
      const data = await query.skip(skip).limit(limit);

      res.paginatedResults = {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        results: data,
      };

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Pagination failed' });
    }
  };
};

module.exports = pagination;
