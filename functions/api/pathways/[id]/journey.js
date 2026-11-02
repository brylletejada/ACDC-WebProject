import { json, toJourneyStep, withDatabase } from "../../../_lib/content.js";

// GET /api/pathways/:id/journey
export const onRequestGet = context => withDatabase(context, async db => {
  const { id } = context.params;
  const pathway = await db.prepare("SELECT id FROM pathways WHERE id = ?").bind(id).first();
  if (!pathway) return json({ error: `No pathway called "${id}".` }, 404);

  const { results } = await db.prepare(
    "SELECT * FROM journey_steps WHERE pathway_id = ? ORDER BY step_order"
  ).bind(id).all();
  return json(results.map(toJourneyStep));
});
