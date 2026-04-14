CREATE TABLE "header_information" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"bio_1" text NOT NULL,
	"bio_2" text NOT NULL,
	"bio_3" text NOT NULL,
	"email" text NOT NULL,
	"avatar_light" text NOT NULL,
	"avatar_dark" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "header_information" (
	"id",
	"name",
	"tagline",
	"bio_1",
	"bio_2",
	"bio_3",
	"email",
	"avatar_light",
	"avatar_dark"
) VALUES (
	'main',
	'Krischal Shrestha',
	'Design-minded developer building scalable systems.',
	'I''m a software engineer mostly messing with AI and code, breaking things and then acting surprised when they break. Currently building Samparka and Upasthit trying to make products that actually work, not just look good in demos.',
	'I also run Rocket Space, where I design fast, minimal websites... because nothing screams bad engineering like a slow "modern" site.',
	'Ship, monitor, iterate, scale. everyday.',
	'krischal.shrestha9849@gmail.com',
	'/profile/pp_light.png',
	'/profile/pp_dark.png'
)
ON CONFLICT ("id") DO NOTHING;
