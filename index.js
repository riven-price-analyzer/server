import R from 'ramda'
import http from 'http'
import paperlane from 'paperplane'
const { json, methods, mount, routes } = paperlane;


const logReqType = req => console.log(`${req.method} ${req.url}`);

const logReq = R.tap(R.pipe(R.prop('body'), console.log));

const logger = 
  R.tap(
    R.pipe(
      R.when(R.is(Error), R.pick(['message', 'name', 'stack'])),
      R.tap(R.pipe(
        R.prop('req'),
        logReqType,
      )),
      R.evolve({
        req: R.pick(['headers', 'method', 'url']),
        res: R.pick(['statusCode'])
      }),
      data => JSON.stringify(data, null, 2),
      console.info,
    )
  )

const app = routes({
  '/stats/:name': methods({
    POST: R.pipe(logReq, R.prop('body'), json),
  }),
  '*': methods({
    GET: hello
  }),
});
 
http
    .createServer(mount({ app, logger }))
    .listen(3000, logger);
