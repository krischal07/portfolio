export const HEADER_INFORMATION_ID = 'main'

export type HeaderInformationValues = {
  name: string
  tagline: string
  bioHtml: string
  email: string
  avatarLight: string
  avatarDark: string
}

export const HEADER_INFORMATION_DEFAULTS: HeaderInformationValues = {
  name: 'Krischal Shrestha',
  tagline: 'Design-minded developer building scalable systems.',
  bioHtml:
    "<p>I'm a software engineer mostly messing with <strong>AI</strong> and code, breaking things and then acting surprised when they break. Currently building <strong>Samparka</strong> and <strong>Upasthit</strong> trying to make products that actually work, not just look good in demos.</p><p>I also run <strong>Rocket Space</strong>, where I design fast, minimal websites... because nothing screams bad engineering like a slow \"modern\" site.</p><p>Ship, monitor, iterate, scale. <strong>everyday</strong>.</p>",
  email: 'krischal.shrestha9849@gmail.com',
  avatarLight: '/profile/pp_light.png',
  avatarDark: '/profile/pp_dark.png',
}
