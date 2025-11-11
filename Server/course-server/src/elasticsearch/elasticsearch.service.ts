import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {
  constructor(private readonly elastic: ElasticsearchService) {}

  async index(index: string, id: string, body: any) {
    return this.elastic.index({
      index,
      id,
      document: body,
    });
  }

  async ensureIndexExists(index: string) {
    try {
      const exists = await this.elastic.indices.exists({ index });

      if (!exists) {
        await this.elastic.indices.create({
          index,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                title: { type: 'text' },
                description: { type: 'text' },
                instructorName: { type: 'text' },
                price: { type: 'double' },
                rating: { type: 'float' },
                students: { type: 'integer' },
                cover: { type: 'keyword' },
              },
            },
          },
        });

        console.log(`Created index [${index}]`);
      } else {
        console.log(`ℹndex [${index}] already exists`);
      }
    } catch (error) {
      console.error(`Failed to ensure index [${index}]`, error);
    }
  }
  async search(index: string, query: any) {
    const result = await this.elastic.search({
      index,
      query,
    });
    return result.hits.hits.map((h) => h._source);
  }

  async delete(index: string, id: string) {
    return this.elastic.delete({ index, id });
  }

  async update(index: string, id: string, doc: any) {
    return this.elastic.update({
      index,
      id,
      doc,
    });
  }

  async ping() {
    try {
      const result = await this.elastic.ping();
      console.log('Elasticsearch connected:', result);
      return true;
    } catch (error) {
      console.error('Elasticsearch connection failed:', error);
      return false;
    }
  }
}
