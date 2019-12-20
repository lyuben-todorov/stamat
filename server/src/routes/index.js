import express from 'express';
import redisClient from '../redis/redisClient';
import mongoClient from '../mongo/mongoClient';

var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
        if (req.session.views) {
                req.session.views++
                res.setHeader('Content-Type', 'text/html')
                res.write('<p>views: ' + req.session.views + '</p>')
                res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
                res.end()
              } else {
                req.session.views = 1
                res.end('welcome to the session demo. refresh!')
              }
});
export default router;