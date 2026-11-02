import { json, toResource, withDatabase } from "../_lib/content.js";

// GET /api/resources
export const onRequestGet = context => withDatabase(context, async db => {
  const { results } = await db.prepare("SELECT * FROM resources ORDER BY sort_order").all();
  return json(results.map(toResource));
});
