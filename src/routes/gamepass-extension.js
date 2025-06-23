import { Router } from 'express';
import getGames from '../helpers/gamepass/fetchGames.js';

const router = Router();


router.get('/', async (req, res) => {
  const data = await getGames('extension');
  res.send({
    updated_at: data.updated_at,
    all: data.all,
    coming: data.coming,
    leaving: data.leaving,
  });
});

router.get('/all', async (req, res) => {
  const data = await getGames('extension');
  res.send(data.all);
});

router.get('/new', async (req, res) => {
  const data = await getGames('extension');
  res.send(data.new);
});

router.get('/coming', async (req, res) => {
  const data = await getGames('extension');
  res.send(data.coming);
});

router.get('/leaving', async (req, res) => {
  const data = await getGames('extension');
  res.send(data.leaving);
});

export default router;
