CREATE TABLE "social_links_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "social_links_settings" ("id", "items") VALUES (
	'main',
	'[
	  {"name":"X","icon":"x","bg":"bg-black","url":"https://x.com/hwrCodes"},
	  {"name":"GitHub","icon":"github","bg":"bg-gray-900","url":"https://github.com/krischal07"},
	  {"name":"LinkedIn","icon":"linkedin","bg":"bg-blue-600","url":"https://www.linkedin.com/in/krischal-shrestha-b74669230/"},
	  {"name":"daily.dev","icon":"dailydev","bg":"bg-gray-950","url":"https://app.daily.dev/username"},
	  {"name":"Instagram","icon":"instagram","bg":"bg-[#ee2a7b]","url":"https://www.instagram.com/krischal_shrestha/"},
	  {"name":"YouTube","icon":"youtube","bg":"bg-red-600","url":"https://youtube.com/@username"}
	]'::jsonb
)
ON CONFLICT ("id") DO NOTHING;
