import { Injectable } from '@nestjs/common';
// import { Professional } from '@prisma/client';
// import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

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
    const searchTerm = 'Find me toctor in Uttara Dhaka';

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

    //     const results = await this.prisma.$queryRaw`
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
    //       id, name, rating, category, zones, branches
    //     FROM search_data
    //     WHERE
    //       search_text ILIKE ANY (ARRAY['%' || ${searchTerm} || '%'])
    //       OR similarity(search_text, LOWER(${searchTerm})) > 0.1
    //     ORDER BY rating DESC
    //     LIMIT 10;
    // `;

    const results = await this.prisma.$queryRaw`
        WITH search_data AS (
          SELECT
            *,
            CONCAT(
              LOWER(category), ' ',
              LOWER(array_to_string(zones, ' ')), ' ',
              LOWER(array_to_string(branches, ' '))
            ) as search_text
          FROM professionals
        )
        SELECT
          id, name, rating, category, zones, branches,
          similarity(search_text, LOWER(${searchTerm})) AS combined_score,
          CASE
            WHEN LOWER(${searchTerm}) ~* '(best|good|excellent|top|great|amazing|outstanding)' THEN rating
            ELSE NULL
          END AS prioritize_rating
        FROM search_data
        WHERE
          search_text ILIKE ANY (ARRAY['%' || ${searchTerm} || '%'])
          OR similarity(search_text, LOWER(${searchTerm})) > 0.1
        ORDER BY
          prioritize_rating DESC NULLS LAST,  -- Only sort by rating if keywords are found
          combined_score DESC  -- Otherwise, use text similarity
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
