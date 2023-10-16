import jwt from 'jsonwebtoken';

export default function checkAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded._id;
      next();
    } catch (e) {
      res
        .status(403)
        .json({
          success: false,
          message: 'Access denied'
        })
    }
  } else {
    return res
      .status(403)
      .json({
        success: false,
        message: 'Access denied',
      });
  }


}