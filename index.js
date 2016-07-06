// jshint node:true, strict:false

'use strict';

const app = require('koa')();
const serve = require('koa-static');

app.use(serve('.'));

app.listen(3434);