import fs from 'fs';
import { Router } from 'express';
const router = Router();

const filePath = './output/output-extension.json';

router.get('/', (req, res) => {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    res.send({
      updated_at: JSON.parse(data).updated_at,
      all: JSON.parse(data).all,
      coming: JSON.parse(data).coming,
      leaving: JSON.parse(data).leaving,
    });
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
