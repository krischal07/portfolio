export const SUB_INFO_ID = 'main'

export type SubInfoItem = {
  icon: string
  label: string | null
  highlight: string | null
  fullWidth: boolean
}

export type SubInfoValues = {
  tzOffset: number
  items: SubInfoItem[]
}

export const SUB_INFO_DEFAULTS: SubInfoValues = {
  tzOffset: 5.75,
  items: [
    { icon: 'code', label: 'Software Engineer', highlight: '@Samparka Digital Loyalty', fullWidth: true },
    { icon: 'bulb', label: 'Co-Founder', highlight: '@Upasthit', fullWidth: true },
    { icon: 'location', label: 'Kathmandu, Nepal', highlight: null, fullWidth: false },
    { icon: 'time', label: null, highlight: null, fullWidth: false },
    { icon: 'phone', label: '+977 9849468588', highlight: null, fullWidth: false },
    { icon: 'email', label: 'krischal.shrestha9849@gmail.com', highlight: null, fullWidth: false },
  ],
}
