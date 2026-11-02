const noStore = { "Cache-Control": "no-store" };

export function json(data, status = 200) {
  const headers = status === 200 ? { "Cache-Control": "public, max-age=300" } : noStore;
  return Response.json(data, { status, headers });
}

export async function withDatabase(context, query) {
  const db = context.env.DB;
  if (!db) return json({ error: "The DB database binding is not configured." }, 500);
  try {
    return await query(db);
  } catch (error) {
    console.error(error);
    return json({ error: "Could not load content." }, 500);
  }
}

const parseList = value => (value ? JSON.parse(value) : []);

export const toPathway = row => ({
  id: row.id,
  icon: row.icon,
  title: row.title,
  tagline: row.tagline,
  text: row.summary,
  details: row.details,
  meta: parseList(row.meta),
  recommended: Boolean(row.is_recommended),
  journeyMapped: Boolean(row.journey_mapped)
});

export const toResource = row => ({
  id: row.id,
  icon: row.icon,
  title: row.title,
  text: row.summary
});

export const toOpportunity = row => ({
  id: row.id,
  pathway: row.pathway_id,
  type: row.type,
  time: row.time_label,
  title: row.title,
  company: row.company,
  description: row.description,
  source: row.source,
  sourceUrl: row.source_url,
  meta: parseList(row.meta),
  sample: Boolean(row.is_sample)
});

export const toJourneyStep = row => ({
  title: row.title,
  text: row.body,
  action: row.action_label,
  type: row.target_type,
  id: row.target_id,
  scroll: row.scroll_target,
  url: row.action_url,
  sample: Boolean(row.is_sample)
});
