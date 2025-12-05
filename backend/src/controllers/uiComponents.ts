import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET /api/uiComponents/homeBackground
// route for getting home screen background pictures
router.get('/homeBackground', async (_req: Request, res: Response) => {
  const dir = path.join(
    process.cwd(),
    'public_html/dist/images/homeBackground',
  );

  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  res.json({ count: files.length, files });
});

export default router;
