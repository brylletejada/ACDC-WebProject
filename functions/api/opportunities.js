import { json, toOpportunity, withDatabase } from "../_lib/content.js";

// GET /api/opportunities?pathway=technology&type=Career%20search (both filters optional)
export const onRequestGet = context => withDatabase(context, async db => {
  const params = new URL(context.request.url).searchParams;
  const filters = [];
  const values = [];
  if (params.get("pathway")) { filters.push("pathway_id = ?"); values.push(params.get("pathway")); }
  if (params.get("type")) { filters.push("type = ?"); values.push(params.get("type")); }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const { results } = await db.prepare(
    `SELECT * FROM opportunities ${where} ORDER BY sort_order`
  ).bind(...values).all();
  return json(results.map(toOpportunity));
});
