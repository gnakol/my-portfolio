import { IsUrl, IsNotEmpty } from 'class-validator';

export class ScrapeJobUrlDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
