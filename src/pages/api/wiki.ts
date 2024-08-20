import type { NextApiRequest, NextApiResponse } from "next";
import wiki from "wikipedia";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const name = req.query.name as string;
    const lang = (req.query.lang as string) ?? "en";

    wiki.setLang(lang);

    try {
      const search = await wiki.search(name);
      const pageId = search.results[0].pageid;
      const page = await wiki.page(pageId);
      const summary = await page.summary();
      const infobox = await page.infobox();

      return res.status(200).json({
        ok: true,
        data: {
          title: summary.title,
          summary: summary.extract,
          thumbnail: summary.thumbnail,
          coordinates: summary.coordinates,
          infobox,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return res.status(400).json({ ok: false });
}
