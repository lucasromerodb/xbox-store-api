import { Router } from 'express';
import fs from 'fs';

const router = Router();

const filePath = './output/output-extension.json';

router.get('/', (req, res) => {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    //TRYING TO CACHE RESPONSE // res.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate").send({
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
