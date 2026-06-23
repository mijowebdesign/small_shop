import { z } from 'zod';


// 1. Definicija Zod šeme za validaciju
export const categorySchema = z.object({
  name: z.object({
    en: z.string()
      .min(2, { message: 'Engleski naziv mora imati najmanje 2 karaktera.' })
      .regex(/^[A-Za-z\s]+$/, { message: 'Engleski naziv mora sadržati samo slova.' }),
    sr: z.string()
      .min(2, { message: 'Srpski naziv mora imati najmanje 2 karaktera.' })
      .regex(/^[A-Za-zА-Яа-яČĆŠĐŽčćšđž\s]+$/, { message: 'Srpski naziv mora sadržati samo slova.' }),
  }),
});