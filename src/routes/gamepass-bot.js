import getGames from '../helpers/gamepass/fetchGames.js';
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  const data = await getGames('bot');
  res.send(data);
});

router.get('/all', async (req, res) => {
  const data = await getGames('bot');
  res.send(data.all);
});

router.get('/new', async (req, res) => {
  const data = await getGames('bot');
  res.send(data.new);
});

router.get('/coming', async (req, res) => {
  const data = await getGames('bot');
  res.send(data.coming);
});

router.get('/leaving', async (req, res) => {
  const data = await getGames('bot');
  res.send(data.leaving);
});

router.get('/updates', async (req, res) => {
  const data = await getGames('bot');
  res.send({
    new: data.new,
    coming: data.coming,
    leaving: data.leaving,
  });
});

router.get('/search', async (req, res) => {
  const data = await getGames('bot');
  res.send({
    all: data.all,
    coming: data.coming,
  });
});

export default router;
