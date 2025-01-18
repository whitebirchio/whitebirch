import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedDate: z.coerce.string(),
    hero: z.string(),
    tags: z.array(z.string()).optional(),
    layout: z.string().optional(),
    youtube: z.string().optional(),
  }),
});

export const collections = { blog };
