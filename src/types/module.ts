import { z } from 'zod';

export const ModuleSchemaValidator = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  dependencies: z.array(z.string()).optional(),
  database: z.object({
    tables: z.array(z.object({
      name: z.string(),
      description: z.string(),
      columns: z.array(z.object({
        name: z.string(),
        type: z.string(),
        description: z.string(),
        nullable: z.boolean().optional(),
        defaultValue: z.any().optional()
      }))
    }))
  }).optional(),
  files: z.array(z.object({
    path: z.string(),
    action: z.enum(['create', 'update', 'delete']),
    content: z.string().optional()
  })),
  hooks: z.object({
    preInstall: z.array(z.string()).optional(),
    postInstall: z.array(z.string()).optional()
  }).optional()
});

export type ModuleSchema = z.infer<typeof ModuleSchemaValidator>;

export interface InstalledModule extends ModuleSchema {
  isActive: boolean;
  installedAt: string;
}