import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedDate: z.coerce.string(),
    hero: z.string(),
    tags: z.array(z.string()).optional(),
    layout: z.string().optional(),
  }),
});

export const collections = { blog };
