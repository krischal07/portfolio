CREATE TABLE "sub_info_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"tz_offset" real DEFAULT 0 NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "sub_info_settings" ("id", "tz_offset", "items") VALUES (
	'main',
	5.75,
	'[
	  {"icon":"code","label":"Software Engineer","highlight":"@Samparka Digital Loyalty","fullWidth":true},
	  {"icon":"bulb","label":"Co-Founder","highlight":"@Upasthit","fullWidth":true},
	  {"icon":"location","label":"Kathmandu, Nepal","highlight":null,"fullWidth":false},
	  {"icon":"time","label":null,"highlight":null,"fullWidth":false},
	  {"icon":"phone","label":"+977 9849468588","highlight":null,"fullWidth":false},
	  {"icon":"email","label":"krischal.shrestha9849@gmail.com","highlight":null,"fullWidth":false}
	]'::jsonb
)
ON CONFLICT ("id") DO NOTHING;
