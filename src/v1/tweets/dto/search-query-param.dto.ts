import { IsNumberString } from 'class-validator';

export class SearchQueryParamDto {
  @IsNumberString()
  page: number;
}
