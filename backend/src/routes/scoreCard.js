import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();

router.delete("/cards", async (_, res) => {
  try {
    await ScoreCard.deleteMany({});
    res.json({ message: "Database cleared" });
  } catch (e) {
    res.json({ message: "Database deletion failed" });
  }
});

router.post("/card", async (req, res) => {
  const name = req.body.name;
  const subject = req.body.subject;
  const score = req.body.score;
  if (score < 0) {
    res.json({ message: "score should not be negative!", card: null });
    return;
  }
  const existing = await ScoreCard.findOne({ name, subject });
  if (existing) {
    try {
      const updated = await ScoreCard.updateOne({ name, subject }, { score });
      res.json({
        message: `Updating (${name}, ${subject}, ${score})`,
        card: updated,
      });
    } catch (e) {
      res.json({
        message: e,
      });
    }
  } else {
    try {
      const newScoreCard = new ScoreCard({ name, subject, score });
      res.json({
        message: `Adding (${name}, ${subject}, ${score})`,
        card: newScoreCard.save(),
      });
    } catch (e) {
      res.json({
        message: e,
      });
    }
  }
});

router.get("/cards", async (req, res) => {
  const qType = req.query.type;
  const qString = req.query.queryString;
  let existing;
  let findRes = [];
  if (qType === "name") {
    existing = await ScoreCard.find({ name: qString });
  } else if (qType === "subject") {
    existing = await ScoreCard.find({ subject: qString });
  }
  if (existing.length > 0) {
    existing.forEach((ele) => {
      findRes.push(`(${ele.name}, ${ele.subject}, ${ele.score})`);
    });
    res.json({ messages: findRes });
  } else {
    res.json({ message: `${qType} (${qString}) not found!` });
  }
});

export default router;
