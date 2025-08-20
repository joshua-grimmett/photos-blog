import { z } from 'zod';

const envSchema = z.object({
  CONTENTFUL_SPACE_ID: z.string(),
  CONTENTFUL_DELIVERY_TOKEN: z.string(),
  SITE_PASSCODE: z.string(),
});

export const env = envSchema.parse(process.env);
