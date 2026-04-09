/**
 * Normalizer — Flattens nested API responses into entity tables.
 * Extracts entities by type, replaces nested entity references with IDs.
 */

import type { EntityTable } from './entity-adapter';

// Schema definitions for entity types
export interface EntitySchema {
  type: string;
  idField: string;
  relationshipFields: string[]; // Fields that contain entity references
}

// Normalized result from normalizing a response
export interface NormalizedResult {
  entities: Record<string, EntityTable<any>>;
  result: string | string[]; // ID(s) of the primary entity/entities
}

/**
 * Normalize a nested API response into entity tables.
 *
 * @param response - Nested API response
 * @param schemas - Entity schema definitions
 * @param primaryType - The primary entity type of the response
 * @returns Normalized result with entity tables and primary result ID(s)
 */
export function normalize(
  response: any,
  schemas: EntitySchema[],
  primaryType: string,
): NormalizedResult {
  const entities: Record<string, EntityTable<any>> = {};
  const visited = new Set<string>(); // Cycle detection

  // Initialize empty tables for each schema
  for (const schema of schemas) {
    entities[schema.type] = {};
  }

  // Find schema for an entity by checking if it matches a schema's structure
  function findSchema(entity: any): EntitySchema | undefined {
    if (!entity || typeof entity !== 'object' || !entity.id) return undefined;
    return schemas.find(s => entity[s.idField] !== undefined && s.type === getEntityType(entity, schemas));
  }

  // Determine entity type based on structure or explicit type field
  function getEntityType(entity: any, schemas: EntitySchema[]): string {
    if (entity.type) return entity.type;
    // Infer from field structure
    for (const schema of schemas) {
      const hasAllFields = schema.relationshipFields.every(f => entity[f] !== undefined);
      if (hasAllFields || entity[schema.idField]) return schema.type;
    }
    return 'unknown';
  }

  // Recursively extract entities
  function extractEntities(data: any): any {
    if (!data || typeof data !== 'object') return data;

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => extractEntities(item));
    }

    // Check if this is an entity (has id and matches a schema)
    if (data.id) {
      const entityType = getEntityType(data, schemas);
      const schema = schemas.find(s => s.type === entityType);

      if (schema) {
        const entityKey = `${entityType}:${data.id}`;

        // Cycle detection
        if (visited.has(entityKey)) {
          return data.id; // Return ID reference instead of re-processing
        }

        visited.add(entityKey);

        // Process relationship fields (replace nested entities with IDs)
        const processedEntity = { ...data };
        for (const relField of schema.relationshipFields) {
          if (processedEntity[relField]) {
            const relData = processedEntity[relField];
            if (Array.isArray(relData)) {
              // Array of entities → extract and replace with ID array
              processedEntity[relField] = relData.map(entity => {
                extractEntities(entity);
                return entity.id;
              });
            } else if (typeof relData === 'object') {
              // Single entity → extract and replace with ID
              const extractedId = relData.id;
              extractEntities(relData);
              processedEntity[relField] = extractedId;
            }
          }
        }

        // Add to entity table (merge with existing if partial)
        const existingEntity = entities[entityType]?.[data.id];
        entities[entityType][data.id] = existingEntity
          ? { ...existingEntity, ...processedEntity }
          : processedEntity;

        // Return ID reference
        return data.id;
      }
    }

    // Not an entity — process nested fields
    const result: any = {};
    for (const key of Object.keys(data)) {
      result[key] = extractEntities(data[key]);
    }
    return result;
  }

  // Process the response
  const result = extractEntities(response);

  return {
    entities,
    result: Array.isArray(result) ? result : result.id || result,
  };
}

/**
 * Merge partial entity with existing entity (deep merge for nested objects)
 */
export function mergePartialEntity<T extends Record<string, any>>(
  existing: T,
  partial: Partial<T>,
): T {
  const merged = { ...existing };

  for (const key of Object.keys(partial)) {
    const partialValue = partial[key];
    const existingValue = existing[key];

    if (
      partialValue &&
      typeof partialValue === 'object' &&
      !Array.isArray(partialValue) &&
      existingValue &&
      typeof existingValue === 'object' &&
      !Array.isArray(existingValue)
    ) {
      // Deep merge nested objects
      merged[key] = mergePartialEntity(existingValue, partialValue);
    } else {
      // Replace or add
      merged[key] = partialValue;
    }
  }

  return merged;
}
