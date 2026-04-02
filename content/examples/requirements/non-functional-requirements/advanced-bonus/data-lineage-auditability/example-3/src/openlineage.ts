import { z } from "zod";

export const DatasetSchema = z.object({
  namespace: z.string().min(1),
  name: z.string().min(1),
});

export const JobSchema = z.object({
  namespace: z.string().min(1),
  name: z.string().min(1),
});

export const RunSchema = z.object({
  runId: z.string().min(1),
});

export const RunEventSchema = z.object({
  eventType: z.enum(["START", "COMPLETE", "FAIL"]),
  eventTime: z.string().min(1),
  job: JobSchema,
  run: RunSchema,
  inputs: z.array(DatasetSchema).default([]),
  outputs: z.array(DatasetSchema).default([]),
  facets: z
    .object({
      documentation: z.object({ description: z.string() }).optional(),
      ownership: z.object({ owners: z.array(z.object({ name: z.string(), type: z.string() })) }).optional(),
      columnLineage: z
        .object({
          mappings: z.array(
            z.object({
              outputColumn: z.string(),
              inputColumns: z.array(z.string()),
            }),
          ),
        })
        .optional(),
    })
    .default({}),
});

export type RunEvent = z.infer<typeof RunEventSchema>;

