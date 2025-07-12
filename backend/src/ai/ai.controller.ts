import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('search')
  @UseGuards(JwtAuthGuard)
  async search(@Body() { query }: { query: string }) {
    try {
      if (!query || query.trim().length === 0) {
        throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
      }

      const searchResults = await this.aiService.searchCrmData(query);

      // Generate a natural language response based on the search results
      const prompt = `You are a helpful CRM assistant. Based on the following search results from a CRM system, provide a helpful and conversational response to the user's query: "${query}"\n\nAvailable Data:\n${JSON.stringify(searchResults, null, 2)}\n\nPlease provide insights about the companies, opportunities, and contacts that match the query. If no relevant data is found, let the user know and suggest they try a different search term.`;
      const response = await this.aiService.complete(prompt);

      return {
        query,
        response,
        data: searchResults,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('AI search error:', error);
      throw new HttpException(
        'Failed to process search request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
