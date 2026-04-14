ALTER TABLE "header_information" ADD COLUMN "bio_html" text DEFAULT '' NOT NULL;

UPDATE "header_information"
SET "bio_html" =
  '<p>' || "bio_1" || '</p>' ||
  '<p>' || "bio_2" || '</p>' ||
  '<p>' || "bio_3" || '</p>'
WHERE "bio_html" = '';
