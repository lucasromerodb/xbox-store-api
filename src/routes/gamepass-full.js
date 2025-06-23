import getGames from '../helpers/gamepass/fetchGames.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const data = await getGames('gamepass');
  res.send(data);
});

router.get('/all', async (req, res) => {
  const data = await getGames('gamepass');
  res.send(data.all);
});

router.get('/new', async (req, res) => {
  const data = await getGames('gamepass');
  res.send(data.new);
});

router.get('/coming', async (req, res) => {
  const data = await getGames('gamepass');
  res.send(data.coming);
});

router.get('/leaving', async (req, res) => {
  const data = await getGames('gamepass');
  res.send(data.leaving);
});

export default router;
