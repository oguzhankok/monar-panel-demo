const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // React'ten gelen istekte 'Bearer <token>' var mı kontrol et
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token'ı ayır
      token = req.headers.authorization.split(' ')[1];
      
      // Şifreyi (.env içindeki secret ile) çöz
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Çözülen kullanıcı bilgilerini (id, role vb.) isteğin içine göm
      req.user = decoded; 
      next(); // İzin ver, yola devam etsin
    } catch (error) {
      res.status(401).json({ message: 'Yetkisiz erişim, token geçersiz veya süresi dolmuş!' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Yetkisiz erişim, token bulunamadı!' });
  }
};

module.exports = { protect };