const path = require('path');
const Koa = require('koa');
const app = new Koa();
const EventEmitter = require('events');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const emitter = new EventEmitter();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve, reject) => {
    emitter.once('message', (message) => {
      resolve(message);
    });
  });

  next();
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (message) {
    emitter.emit('message', message);
  }

  ctx.status = 200;
  next();
});

app.use(router.routes());

module.exports = app;
