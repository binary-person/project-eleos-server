import admin from 'firebase-admin';

// ref: https://javascript.plainenglish.io/lets-create-react-app-with-firebase-auth-express-backend-and-mongodb-database-805c83e4dadd
export default async function decodeIDToken(req, res, next) {
  const header = req.headers?.authorization;
  if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (!decodedToken.email_verified) {
        unauthorizedCounter.labels(req.path, 'unverified-email').inc();
        res.sendStatus(401);
        return;
      }
      req.currentUser = decodedToken;
      next();
      return;
    } catch (err) {
      console.log(err);
    }
    unauthorizedCounter.labels(req.path, 'bad-token').inc();
  } else {
    unauthorizedCounter.labels(req.path, 'missing-token').inc();
  }
  res.sendStatus(401);
}
