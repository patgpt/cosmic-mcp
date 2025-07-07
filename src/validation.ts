import { z } from "zod";

// Base validation schemas
export const statusSchema = z
  .enum(["published", "draft", "any"])
  .default("published");
export const objectStatusSchema = z
  .enum(["published", "draft"])
  .default("draft");
export const localeSchema = z.string().optional();
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");
export const metadataSchema = z.record(z.any()).optional();

// Validation schemas for each tool
export const listObjectsSchema = z.object({
  type_slug: z.string().optional(),
  limit: z.number().int().min(1).max(1000).default(100),
  skip: z.number().int().min(0).default(0),
  sort: z.string().default("-created_at"),
  status: statusSchema,
  locale: localeSchema,
});

export const getObjectSchema = z.union([
  z.object({
    id: z.string().min(1),
    locale: localeSchema,
  }),
  z.object({
    slug: z.string().min(1),
    type_slug: z.string().min(1),
    locale: localeSchema,
  }),
]);

export const createObjectSchema = z.object({
  title: z.string().min(1).max(200),
  type_slug: z.string().min(1),
  slug: slugSchema.optional(),
  content: z.string().optional(),
  status: objectStatusSchema,
  metadata: metadataSchema,
  locale: localeSchema,
});

export const updateObjectSchema = z.intersection(
  z.union([
    z.object({
      id: z.string().min(1),
    }),
    z.object({
      slug: z.string().min(1),
      type_slug: z.string().min(1),
    }),
  ]),
  z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().optional(),
    status: objectStatusSchema.optional(),
    metadata: metadataSchema,
    locale: localeSchema,
  })
);

export const deleteObjectSchema = z.union([
  z.object({
    id: z.string().min(1),
  }),
  z.object({
    slug: z.string().min(1),
    type_slug: z.string().min(1),
  }),
]);

export const listObjectTypesSchema = z.object({});

export const uploadMediaSchema = z.object({
  file_data: z.string().min(1, "File data is required"),
  filename: z.string().min(1, "Filename is required"),
  folder: z.string().optional(),
});

export const listMediaSchema = z.object({
  limit: z.number().int().min(1).max(1000).default(100),
  skip: z.number().int().min(0).default(0),
  folder: z.string().optional(),
});

export const deleteMediaSchema = z.object({
  id: z.string().min(1),
});

export const searchObjectsSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  type_slug: z.string().optional(),
  limit: z.number().int().min(1).max(1000).default(100),
  locale: localeSchema,
});

// Tool validation map
export const toolValidationMap = {
  list_objects: listObjectsSchema,
  get_object: getObjectSchema,
  create_object: createObjectSchema,
  update_object: updateObjectSchema,
  delete_object: deleteObjectSchema,
  list_object_types: listObjectTypesSchema,
  upload_media: uploadMediaSchema,
  list_media: listMediaSchema,
  delete_media: deleteMediaSchema,
  search_objects: searchObjectsSchema,
} as const;

// Type definitions for validated inputs
export type ListObjectsInput = z.infer<typeof listObjectsSchema>;
export type GetObjectInput = z.infer<typeof getObjectSchema>;
export type CreateObjectInput = z.infer<typeof createObjectSchema>;
export type UpdateObjectInput = z.infer<typeof updateObjectSchema>;
export type DeleteObjectInput = z.infer<typeof deleteObjectSchema>;
export type ListObjectTypesInput = z.infer<typeof listObjectTypesSchema>;
export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;
export type ListMediaInput = z.infer<typeof listMediaSchema>;
export type DeleteMediaInput = z.infer<typeof deleteMediaSchema>;
export type SearchObjectsInput = z.infer<typeof searchObjectsSchema>;

// Helper function to validate input for any tool
export function validateToolInput(toolName: string, input: any) {
  const schema = toolValidationMap[toolName as keyof typeof toolValidationMap];
  if (!schema) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  return schema.parse(input);
}

// Error formatter for validation errors
export function formatValidationError(error: z.ZodError): string {
  const issues = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });
  return `Validation failed: ${issues.join(", ")}`;
}
