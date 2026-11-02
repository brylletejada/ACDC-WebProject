import { json, toPathway, withDatabase } from "../../_lib/content.js";

// GET /api/pathways
export const onRequestGet = context => withDatabase(context, async db => {
  const { results } = await db.prepare(`
    SELECT p.*, EXISTS (SELECT 1 FROM journey_steps s WHERE s.pathway_id = p.id) AS journey_mapped
    FROM pathways p
    ORDER BY p.sort_order
  `).all();
  return json(results.map(toPathway));
});
