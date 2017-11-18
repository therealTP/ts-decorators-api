import { INewsSource } from './../interfaces/NewsSource';
import { CountryAbbrevType } from './../enums/CountryAbbrevType';

export class NewsSourceResponse implements INewsSource {
    id: string;
    name: string;
    websiteUrl: string;
    slug: string;
    logoUrl: string;
    twitterUsername: string;
    youtubeUsername: string;
    nonProfit: boolean;
    sellsAds: boolean;
    country: CountryAbbrevType;
    created: Date;
    updated: Date;
}