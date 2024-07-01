import { IsNumberString, IsOptional } from 'class-validator';

export class SearchQueryParamDto {
  @IsNumberString()
  @IsOptional()
  page?: number;
}
