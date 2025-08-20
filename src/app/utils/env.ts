import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CONTENTFUL_SPACE_ID: z.string(),
  NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN: z.string(),
  SITE_PASSCODE: z.string(),
});

export const env = envSchema.parse(process.env);
