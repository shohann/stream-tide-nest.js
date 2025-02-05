import { Injectable } from '@nestjs/common';
// import { Professional } from '@prisma/client';
// import { Prisma } from '@prisma/client';
// import { PrismaService } from 'src/database/prisma.service';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  users: {
    id: number;
    name: string;
    age: number;
    gender: string;
  }[] = [
    {
      id: 1,
      name: 'shohann',
      age: 10,
      gender: 'male',
    },
    {
      id: 2,
      name: 'shohann2',
      age: 11,
      gender: 'male',
    },
  ];

  async getAllUsers() {
    // const results = await this.prisma.$queryRaw`
    // WITH search_data AS (
    //   SELECT
    //     *,
    //     CONCAT(
    //       LOWER(category), ' ',
    //       LOWER(array_to_string(zones, ' ')), ' ',
    //       LOWER(array_to_string(branches, ' '))
    //     ) as search_text
    //   FROM professionals
    // )
    // SELECT
    //   id, name, rating, category, zones, branches,
    //   (
    //     similarity(search_text, LOWER(${searchTerm}))
    //   ) AS combined_score
    // FROM search_data
    // WHERE
    //   search_text ILIKE ANY (ARRAY['%' || ${searchTerm} || '%'])
    //   OR similarity(search_text, LOWER(${searchTerm})) > 0.1
    // ORDER BY combined_score DESC, rating DESC
    // LIMIT 10;
    // `;

    // const searchTerm = 'Find me toctor';
    // const searchTerm = 'Find me the best doctor in uttara dhaka';
    // const searchTerm = 'Find me the best doctor in bhaka';

    // const results = await this.prisma.$queryRaw`
    //     WITH search_data AS (
    //       SELECT
    //         *,
    //         CONCAT(
    //           LOWER(category), ' ',
    //           LOWER(array_to_string(zones, ' ')), ' ',
    //           LOWER(array_to_string(branches, ' '))
    //         ) as search_text
    //       FROM professionals
    //     )
    //     SELECT
    //       id, name, rating, category, zones, branches,
    //       similarity(search_text, LOWER(${searchTerm})) AS combined_score,
    //       CASE
    //         WHEN LOWER(${searchTerm}) ~* '(best|good|excellent|top|great|amazing|outstanding)' THEN rating
    //         ELSE NULL
    //       END AS prioritize_rating
    //     FROM search_data
    //     WHERE
    //       search_text ILIKE ANY (ARRAY['%' || ${searchTerm} || '%'])
    //       OR similarity(search_text, LOWER(${searchTerm})) > 0.1
    //     ORDER BY
    //       prioritize_rating DESC NULLS LAST,  -- Only sort by rating if keywords are found
    //       combined_score DESC  -- Otherwise, use text similarity
    //     LIMIT 10;
    // `;

    // const searchTerm = 'Find doctor'; // doctpr
    // const searchTerm = 'Find me the best doctor in uttara dhaka';
    const searchTerm = 'Find me the best toctor in ittara fhaka';

    const results = await this.prisma.$queryRaw`

    -- Create a temporary dataset with relevant search calculations
WITH search_data AS (
    SELECT 
        id, 
        name, 
        rating, 
        category, 
        zones, 
        branches,

        -- Calculate similarity between the search term and category (helps with fuzzy matching)
        similarity(LOWER(category), LOWER(${searchTerm})) AS cat_sim,

        -- Calculate similarity between the search term and zones (for location-based search)
        similarity(LOWER(array_to_string(zones, ' ')), LOWER(${searchTerm})) AS zone_sim,

        -- Calculate similarity between the search term and branches (to match different branches)
        similarity(LOWER(array_to_string(branches, ' ')), LOWER(${searchTerm})) AS branch_sim,

        -- Create a full-text search vector for better matching across category, zones, and branches
        to_tsvector('english', category || ' ' || array_to_string(zones, ' ') || ' ' || array_to_string(branches, ' ')) AS search_tsvector, 

        -- Check if the search term is present in category (helps with exact matching)
        LOWER(category) ILIKE '%' || LOWER(${searchTerm}) || '%' AS cat_match,

        -- Check if the search term is present in zones (helps with exact matching)
        LOWER(array_to_string(zones, ' ')) ILIKE '%' || LOWER(${searchTerm}) || '%' AS zone_match,

        -- Check if the search term is present in branches (helps with exact matching)
        LOWER(array_to_string(branches, ' ')) ILIKE '%' || LOWER(${searchTerm}) || '%' AS branch_match
    FROM professionals
)

-- Select only the necessary fields to return in the search results
SELECT 
    id, 
    name, 
    rating, 
    category, 
    zones, 
    branches
FROM search_data s
WHERE 
    -- Ensure results match either by similarity or exact match in category
    (s.cat_sim > 0.1 OR s.cat_match)

    -- Ensure location-based results are only considered if at least one zone or branch matches
    AND (
        CASE WHEN EXISTS (
            SELECT 1 FROM search_data 
            WHERE (zone_sim > 0.1 OR zone_match OR branch_sim > 0.1 OR branch_match)
        )
        THEN (s.zone_sim > 0.1 OR s.zone_match OR s.branch_sim > 0.1 OR s.branch_match)
        ELSE TRUE  -- If no location-based matches exist, include all category matches
        END
    )

-- Order the results by relevance: prioritize category matches, then zone/branch matches
ORDER BY 
    CASE WHEN EXISTS (
        SELECT 1 FROM search_data 
        WHERE (zone_sim > 0.1 OR zone_match OR branch_sim > 0.1 OR branch_match)
    )
    -- Give more weight to category matches, but also consider zone and branch similarities
    THEN (s.cat_sim * 2 + COALESCE(s.zone_sim, 0) + COALESCE(s.branch_sim, 0))
    ELSE s.cat_sim  -- If no zone/branch match, just use category similarity
    END DESC

-- Limit to top 10 results for better performance and user experience
LIMIT 10;

`;

    return results;
  }

  getUserById(id: number) {
    return this.users.find((x) => x.id === id);
  }

  createUser(user: { id: number; name: string; age: number; gender: string }) {
    this.users.push(user);
  }
}

// CREATE EXTENSION IF NOT EXISTS pg_trgm;

// CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

// https://dev.to/moritzrieger/build-a-fuzzy-search-with-postgresql-2029
