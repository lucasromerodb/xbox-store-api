import fs from "fs";
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  fs.readFile("./extension_output/output.json", function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});

export default router;
