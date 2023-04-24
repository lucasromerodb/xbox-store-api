import fs from 'fs';
import { Router } from 'express';
const router = Router();

const filePath = './output/output-bot.json';

router.get('/', (req, res) => {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});

router.get('/all', (req, res) => {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data).all);
  });
});

router.get('/new', (req, res) => {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data).new);
  });
});

router.get('/coming', (req, res) => {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data).coming);
  });
});

router.get('/leaving', (req, res) => {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data).leaving);
  });
});

export default router;
